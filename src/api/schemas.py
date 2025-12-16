from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AnalysisResponse(BaseModel):
    analysis: Dict[str, Any]
    filename: str
    plots: List[str]

class RecommendationRequest(BaseModel):
    analysis: Dict[str, Any]
    filename: str

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    tips: List[str]
    time_estimates: Dict[str, str]

class BenchmarkRequest(BaseModel):
    filename: str
    target_col: str
    recommmendations: List[Dict[str, Any]]

class BenchmarkResponse(BaseModel):
    results: List[Dict[str, Any]]

class CompetitionPlanRequest(BaseModel):
    analysis: Dict[str, Any]
    filename: str

class CompetitionPlanResponse(BaseModel):
    baseline: Dict[str, str]
    advanced: Dict[str, str]
    featureEngineering: List[str]
    hyperparameters: List[Dict[str, str]]
