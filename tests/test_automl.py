import pytest
import pandas as pd
import sys
import os

# Ensure src is in path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.automl.runner import AutoMLRunner
from src.algorithms.base import Algorithm
from src.algorithms.definitions import register_all_algorithms

def test_automl_classification():
    register_all_algorithms()
    
    # Dummy Data
    df = pd.DataFrame({
        "A": [1, 2, 3, 4, 1, 2, 3, 4] * 10,
        "B": [5.0, 2.0, 1.0, 0.0, 5.0, 2.0, 1.0, 0.0] * 10,
        "target": ["Yes", "No", "Yes", "No", "Yes", "No", "Yes", "No"] * 10
    })
    
    # Dummy Recommendations
    recs = [
        {"algorithm": Algorithm("Logistic Regression", "classification", "", [], [], 1)},
        {"algorithm": Algorithm("Random Forest", "classification", "", [], [], 5)}
    ]
    
    runner = AutoMLRunner()
    results = runner.run_benchmark(df, "target", recs)
    
    assert not results.empty
    assert "Accuracy" in results["Metric"].values
    assert results.iloc[0]["Status"] == "Success"
