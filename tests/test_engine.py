import pytest
import sys
import os

# Ensure src is in path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.algorithms.base import Algorithm
from src.algorithms.registry import AlgorithmRegistry
from src.engine import HeuristicRanker
import src.algorithms.definitions # Triggers registration

@pytest.fixture
def ranker():
    return HeuristicRanker()

@pytest.fixture
def dummy_analysis_result():
    return {
        "basic_stats": {"n_rows": 500, "n_columns": 10},
        "feature_types": {"numerical": 8, "categorical": 2},
        "missing_stats": {"has_missing_values": False},
        "imbalance_stats": {"type": "classification", "is_imbalanced": False}
    }

def test_rank_basic(ranker, dummy_analysis_result):
    recs = ranker.rank(dummy_analysis_result, top_k=5)
    assert len(recs) > 0
    # Random Forest is usually good for this generic profile
    names = [r["algorithm"].name for r in recs]
    assert "Random Forest" in names or "Logistic Regression" in names

def test_missing_value_penalty(ranker, dummy_analysis_result):
    dummy_analysis_result["missing_stats"]["has_missing_values"] = True
    
    recs = ranker.rank(dummy_analysis_result, top_k=10)
    
    # Find Logistic Regression (which doesn't handle missing natively in our def)
    lr_rec = next((r for r in recs if r["algorithm"].name == "Logistic Regression"), None)
    
    if lr_rec:
        assert any("missing values" in reason for reason in lr_rec["reasons"]), "Should have missing value penalty reason"
        assert lr_rec["score"] < 100 # Should be penalized

def test_small_data_penalty(ranker, dummy_analysis_result):
    dummy_analysis_result["basic_stats"]["n_rows"] = 30 # Very small
    
    recs = ranker.rank(dummy_analysis_result, top_k=5)
    
    # MLP should be terrible or excluded
    mlp_rec = next((r for r in recs if r["algorithm"].name == "Multi-Layer Perceptron (MLP)"), None)
    
    if mlp_rec:
        assert mlp_rec["score"] < 50 # massive penalty
        assert any("scale" in reason or "complex" in reason.lower() for reason in mlp_rec["reasons"])
    
    # Simple models should be top
    top_algo = recs[0]["algorithm"]
    assert top_algo.complexity_score <= 5 # Not a deep learning model

def test_problem_type_filtering(ranker, dummy_analysis_result):
    # Set to regression
    dummy_analysis_result["imbalance_stats"] = {"type": "regression"}
    
    recs = ranker.rank(dummy_analysis_result)
    for rec in recs:
        assert rec["algorithm"].type == "regression"
    
    names = [r["algorithm"].name for r in recs]
    assert "Linear Regression" in names
    assert "Logistic Regression" not in names
