from typing import List, Dict, Any

class CompetitionAdvisor:
    """
    Provides strategic tips and time budget estimations for ML competitions.
    """
    
    def estimate_time_budget(self, n_rows: int, n_cols: int, algo_complexity: int) -> str:
        """
        Heuristic to estimate training time scale.
        """
        # A rough complexity metric: rows * cols * complexity
        computational_load = n_rows * n_cols * algo_complexity
        
        # Thresholds tuned heuristically (very rough approximations)
        if computational_load < 500_000:
            return "Seconds"
        elif computational_load < 10_000_000:
            return "Minutes"
        elif computational_load < 100_000_000:
            return "Minutes to Hours"
        else:
            return "Hours (GPU Recommended)"

    def get_baseline_suggestion(self, problem_type: str = "classification") -> str:
        """Suggests a solid baseline model."""
        if problem_type == "classification":
            return "Random Forest (with default parameters) or Logistic Regression"
        else:
            return "Random Forest Regressor or Ridge Regression"

    def get_kaggle_tips(self, analysis: Dict[str, Any]) -> List[str]:
        """
        Generates Kaggle-specific tips based on analysis.
        """
        tips = []
        
        missing = analysis.get("missing_stats") or {}
        imbalance = analysis.get("imbalance_stats") or {}
        feature_types = analysis.get("feature_types") or {}
        
        if missing.get("has_missing_values", False):
            tips.append("💡 Tip: XGBoost and LightGBM handle missing values natively. Using them saves you from complex imputation strategies.")
            
        if imbalance.get("is_imbalanced", False):
            tips.append("💡 Tip: For imbalanced data, try StratifiedKFold cross-validation and use Metrics like F1-Macro or AUC instead of Accuracy.")
            
        if feature_types.get("numerical", 0) > 0 and feature_types.get("categorical", 0) > 0:
            tips.append("💡 Tip: Tree-based models (RF, XGB) often outperform Linear models on mixed data types without heavy preprocessing.")
            
        if feature_types.get("categorical", 0) > 5:
            tips.append("💡 Tip: High cardinality categoricals? Try Target Encoding or CatBoost which handles them automatically.")

        # General advice
        tips.append("💡 Tip: Always start with a simple baseline submission to test the end-to-end pipeline before tuning complex models.")
        
        return tips

    def generate_competition_plan(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a full competition plan including code snippets.
        """
        target_info = analysis.get("target_analysis", {})
        is_classification = True # Default
        if target_info:
             # Heuristic to determine type if not explicitly stated
             # Assuming likely classification if low cardinality
             unique_count = target_info.get("n_unique", 0)
             dtype = target_info.get("dtype", "")
             if "float" in dtype and unique_count > 50:
                 is_classification = False
        
        # Override if explicitly in analysis
        if "problem_type" in analysis:
            is_classification = analysis["problem_type"] == "classification"

        # Baseline Code
        if is_classification:
            baseline_model = "LightGBM Classifier"
            baseline_code = """import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# baseline
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = lgb.LGBMClassifier(n_estimators=100)
clf.fit(X_train, y_train)
preds = clf.predict_proba(X_test)[:, 1]
print("AUC:", roc_auc_score(y_test, preds))"""
            baseline_score = "0.80+"
            
            advanced_model = "Ensemble (XGB + CatBoost + LGBM)"
            advanced_code = """from sklearn.ensemble import VotingClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

est = [
    ('xgb', XGBClassifier(n_estimators=500, learning_rate=0.05)),
    ('lgb', LGBMClassifier(n_estimators=500, learning_rate=0.05)),
    ('cat', CatBoostClassifier(iterations=500, verbose=0))
]
voting = VotingClassifier(estimators=est, voting='soft')
voting.fit(X_train, y_train)"""
            advanced_score = "0.88+"

        else: # Regression
            baseline_model = "XGBoost Regressor"
            baseline_code = """from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
reg = XGBRegressor(n_estimators=100)
reg.fit(X_train, y_train)
preds = reg.predict(X_test)
print("RMSE:", mean_squared_error(y_test, preds, squared=False))"""
            baseline_score = "Top 50%"
            
            advanced_model = "Stacked Regressors"
            advanced_code = """from sklearn.ensemble import StackingRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

estimators = [
    ('xgb', XGBRegressor(n_estimators=500)),
    ('lgb', LGBMRegressor(n_estimators=500))
]
stack = StackingRegressor(estimators=estimators, final_estimator=LinearRegression())
stack.fit(X_train, y_train)"""
            advanced_score = "Top 10%"

        # Feature Engineering Tips
        fe_tips = []
        feature_types = analysis.get("feature_types", {})
        if feature_types.get("date_columns", 0) > 0:
             fe_tips.append("Extract Aggregations from Date columns (Day, Month, Quarter)")
        if feature_types.get("text_columns", 0) > 0:
             fe_tips.append("Use TF-IDF or BERT embeddings for text columns")
        
        fe_tips.append("Create interaction features for top correlated variables")
        fe_tips.append("Try target encoding for high cardinality categoricals")
        
        # Hparams
        hparams = [
             {"param": "learning_rate", "range": "0.01 - 0.1", "tip": "Lower is better but slower"},
             {"param": "max_depth", "range": "3 - 10", "tip": "Tune validation depth to avoid overfitting"},
             {"param": "subsample", "range": "0.6 - 0.9", "tip": "Helps reduce variance"}
        ]

        return {
            "baseline": {
                "model": baseline_model,
                "expectedScore": baseline_score,
                "time": "2-5 mins",
                "code": baseline_code
            },
            "advanced": {
                "model": advanced_model,
                "expectedScore": advanced_score,
                "time": "30-60 mins",
                "code": advanced_code
            },
            "featureEngineering": fe_tips,
            "hyperparameters": hparams
        }
