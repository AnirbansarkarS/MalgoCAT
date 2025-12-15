from typing import List, Dict, Any
from src.algorithms.base import Algorithm
from src.algorithms.registry import AlgorithmRegistry

class HeuristicRanker:
    """
    Ranks algorithms based on dataset analysis "fingerprints" and algorithm metadata.
    """

    def rank(self, analysis_result: Dict[str, Any], top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Main ranking function.
        
        Args:
            analysis_result: The dictionary output from DatasetAnalyzer.
            top_k: Number of top recommendations to return.
            
        Returns:
            List of dictionaries containing {"algorithm": Algorithm, "score": float, "reasons": List[str]}
        """
        ranked_list = []
        
        # 1. Determine Problem Type (Classification vs Regression)
        target_stats = analysis_result.get("imbalance_stats", {})
        problem_type = "classification" # Default
        if target_stats and target_stats.get("type") == "regression":
            problem_type = "regression"
        elif target_stats and target_stats.get("type") == "classification":
            problem_type = "classification"
        # Note: robust target detection from phase 1 helps here
        
        # Get Candidate Algorithms
        candidates = AlgorithmRegistry.get_by_type(problem_type)
        
        for algo in candidates:
            score, reasons = self._score_algorithm(algo, analysis_result)
            if score > -float('inf'): # Filter out incompatible ones
                ranked_list.append({
                    "algorithm": algo,
                    "score": score,
                    "reasons": reasons
                })
        
        # Sort by score descending
        ranked_list.sort(key=lambda x: x["score"], reverse=True)
        
        return ranked_list[:top_k]

    def _score_algorithm(self, algo: Algorithm, stats: Dict[str, Any]) -> (float, List[str]):
        """
        Calculates a compatibility score for an algorithm.
        Base score: 100.
        """
        score = 100.0
        reasons = []
        
        # Unpack stats
        basic_stats = stats.get("basic_stats") or {}
        missing_stats = stats.get("missing_stats") or {}
        feature_types = stats.get("feature_types") or {}
        imbalance_stats = stats.get("imbalance_stats") or {}
        
        n_rows = basic_stats.get("n_rows", 0)
        has_missing = missing_stats.get("has_missing_values", False)
        
        # --- Compatibility Checks (Penalties) ---
        
        # 1. Missing Values
        if has_missing and not algo.handle_missing:
            score -= 50
            reasons.append("Does not handle missing values natively (requires imputation)")
        
        # 2. Dataset Size vs Complexity
        # Penalty for complex models on tiny data
        if n_rows < 50 and algo.complexity_score > 5:
            score -= 60
            reasons.append(f"Too complex for small dataset ({n_rows} rows)")
        elif n_rows < 200 and algo.complexity_score > 7: # e.g. Deep Learning
             score -= 80
             reasons.append("Requires much more data")

        # Penalty for simple models on large data (Optimization/Speed tradeoff aside, performance might cap)
        if n_rows > 10000 and algo.complexity_score < 3: # e.g. Linear
             # Not necessarily bad, but maybe less capable
             score -= 10
             reasons.append("May underfit large/complex data")
             
        # 3. Min Samples Requirement
        if n_rows < algo.min_samples:
            score = -float('inf') # Hard exclusion
            reasons.append(f"Below min samples requirement ({algo.min_samples})")

        # --- Bonuses ---
        
        # 1. Interpretability Preference (Implicit low complexity bonus)
        if algo.complexity_score <= 3:
            score += 10
            reasons.append("Highly interpretable")
            
        # 2. Robustness to Imbalance (Tree ensembles are generally good)
        if imbalance_stats and imbalance_stats.get("is_imbalanced", False):
            if "Tree" in algo.description or "Forest" in algo.name or "Boost" in algo.name:
                score += 15
                reasons.append("Handles class imbalance well")
        
        return score, reasons
