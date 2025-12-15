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
