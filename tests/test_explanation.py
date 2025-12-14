import pytest
import sys
import os

# Ensure src is in path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.explanations.llm_engine import ExplanationEngine

def test_generate_simple_explanation():
    engine = ExplanationEngine()
    context = {
        "basic_stats": {"n_rows": 100},
        "missing_stats": {"missing_ratio": 0.0},
        "imbalance_stats": {}
    }
    reasons = ["Highly interpretable"]
    
    text = engine.generate_explanation("Logistic Regression", context, reasons)
    
    assert "Logistic Regression" in text
    assert "interpretab" in text # Matches interpretable or interpretability
    assert "small dataset size" in text

def test_generate_complex_explanation():
    engine = ExplanationEngine()
    context = {
        "basic_stats": {"n_rows": 1000},
        "missing_stats": {"missing_ratio": 0.05},
        "imbalance_stats": {"class_distribution": {"A": 0.9, "B": 0.1}}
    }
    reasons = ["Handles missing values", "Handles class imbalance well"]
    
    text = engine.generate_explanation("Random Forest", context, reasons)
    
    assert "missing values" in text
    assert "5.0% missing" in text
    assert "imbalanced" in text
