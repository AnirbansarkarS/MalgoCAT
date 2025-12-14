from typing import Dict, Any, List

class ExplanationEngine:
    """
    Generates human-readable explanations for algorithm recommendations.
    Currently uses a template-based 'Mock LLM' approach, but is designed
    to be swapped with an actual LLM client (OpenAI/Gemini).
    """
    
    def generate_explanation(self, algo_name: str, context: Dict[str, Any], reasons: List[str]) -> str:
        """
        Generates a natural language explanation.
        
        Args:
            algo_name: Name of the recommended algorithm.
            context: The full dataset analysis result dictionary.
            reasons: List of short technical reasons gathered by the Ranker.
            
        Returns:
            A string containing the explanation.
        """
        # Extract context
        imbalance = context.get("imbalance_stats", {})
        missing = context.get("missing_stats", {})
        n_rows = context.get("basic_stats", {}).get("n_rows", 0)
        
        # Build the explanation construction
        parts = []
        
        # Intro
        parts.append(f"**{algo_name}** is a strong candidate for your dataset.")
        
        # Address Key Reasons
        if reasons:
            parts.append("Key factors in this decision include:")
            for r in reasons:
                # Convert short technical reason to sentence
                if "missing values" in r.lower():
                    if "does not" in r.lower():
                        parts.append(f"- Note: This model does NOT natively handle missing values ({missing.get('missing_ratio', 0):.1%} missing), so imputation is required.")
                    else:
                        parts.append(f"- It natively handles the missing values detected in your data ({missing.get('missing_ratio', 0):.1%} missing).")
                elif "imbalance" in r.lower():
                    parts.append(f"- Your target variable is imbalanced ({imbalance.get('class_distribution')}), and this model is known to be robust to that.")
                elif "interpretable" in r.lower():
                    parts.append("- Since your dataset is relatively small/simple, this model offers excellent interpretability.")
                elif "complex" in r.lower():
                    parts.append("- Your data appears complex, and this model has the capacity to capture non-linear patterns.")
                else:
                    parts.append(f"- {r}.")
        
        # Data Context
        if n_rows < 500:
            parts.append("Given the small dataset size, we prioritized models that are less prone to overfitting.")
        elif n_rows > 10000:
            parts.append("With a larger dataset, this model's scalability is an asset.")

        return " ".join(parts)
