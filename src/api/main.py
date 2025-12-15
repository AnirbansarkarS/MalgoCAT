from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import pandas as pd
import json
from src.analyzer import DatasetAnalyzer
from src.engine import HeuristicRanker
from src.explanations.llm_engine import ExplanationEngine
from src.competition.advisor import CompetitionAdvisor
from src.automl.runner import AutoMLRunner
from src.api.schemas import AnalysisResponse, RecommendationRequest, RecommendationResponse, BenchmarkRequest, BenchmarkResponse

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "*"], # adjust port if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        if file.filename.endswith('.csv'):
            # Try reading with different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            df = None
            error_details = []
            
            for encoding in encodings:
                try:
                    df = pd.read_csv(file_path, encoding=encoding)
                    break
                except UnicodeDecodeError:
                    error_details.append(f"{encoding}: failed")
                    continue
                except Exception as e:
                     error_details.append(f"{encoding}: {str(e)}")
                     continue
            
            if df is None:
                 raise HTTPException(status_code=400, detail=f"Could not decode CSV file. Tried encodings: {', '.join(encodings)}. Errors: {'; '.join(error_details)}")
        else:
            raise HTTPException(status_code=400, detail="Only CSV files supported for now.")
            
        analyzer = DatasetAnalyzer(df)
        results = analyzer.analyze()
        
        # Convert NaN to None for JSON serialization and handle numpy types
        results = json_safe(results, filename=file.filename)
        
        return {"analysis": results, "filename": file.filename}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def json_safe(obj, filename=""):
    """Recursively convert numpy types and NaNs to JSON serializable types."""
    # Handle composites first
    if isinstance(obj, dict):
        return {k: json_safe(v, filename) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [json_safe(x, filename) for x in obj]
    if hasattr(obj, 'tolist'): # Handle numpy arrays/series
        return json_safe(obj.tolist(), filename)
        
    # Handle scalars
    if pd.isna(obj):
        return None
    if isinstance(obj, (pd.Timestamp, pd.Timedelta)):
        return str(obj)
    if hasattr(obj, 'item'): # numpy scalar types
        return obj.item()
        
    return obj

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        analysis = request.analysis
        # Re-construct ranker flow
        ranker = HeuristicRanker()
        rank_results = ranker.rank(analysis, top_k=3)
        
        # Explanation
        explainer = ExplanationEngine()
        advisor = CompetitionAdvisor()
        
        recommendations = []
        time_estimates = {}
        
        n_rows = analysis["basic_stats"]["n_rows"]
        n_cols = analysis["basic_stats"]["n_columns"]

        for rec in rank_results:
            algo = rec["algorithm"]
            explanation = explainer.generate_explanation(algo.name, analysis, rec["reasons"])
            time_est = advisor.estimate_time_budget(n_rows, n_cols, algo.complexity_score)
            
            recommendations.append({
                "algorithm": algo.name,
                "score": rec["score"],
                "explanation": explanation,
                "reasons": rec["reasons"]
            })
            time_estimates[algo.name] = time_est
            
        tips = advisor.get_kaggle_tips(analysis)
        
        return {
            "recommendations": recommendations,
            "tips": tips,
            "time_estimates": time_estimates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/benchmark", response_model=BenchmarkResponse)
async def run_benchmark(request: BenchmarkRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File session expired or not found.")
        
    try:
        df = pd.read_csv(file_path)
        
        # Re-construct recommendations in the format expected by runner
        # Runner expects [{"algorithm": AlgorithmObj}, ...]
        # We need to lookup AlgorithmObj from name
        from src.algorithms.registry import AlgorithmRegistry
        
        runner_recs = []
        for rec in request.recommmendations:
            # We assume rec has "algorithm" name string
            name = rec["algorithm"]
            # We need to find the algo object. Registry isn't fully indexed by name easily exposed,
            # but we can search or modify registry.
            # Let's add a helper to registry or just iterate.
            # For now, simplest is to re-fetch from registry if we had a get_by_name
            # But wait, registry.get_all returns a list.
            
            # Simple hack: Reuse definitions
            all_algos = AlgorithmRegistry.get_all()
            algo_obj = next((a for a in all_algos if a.name == name), None)
            
            if algo_obj:
                runner_recs.append({"algorithm": algo_obj})
        
        runner = AutoMLRunner()
        results_df = runner.run_benchmark(df, request.target_col, runner_recs)
        
        return {"results": results_df.to_dict(orient="records")}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
