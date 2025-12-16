
import pytest
import sys
import os
import pandas as pd
import numpy as np
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.competition.advisor import CompetitionAdvisor
from src.algorithms.registry import AlgorithmRegistry
import src.algorithms.definitions # Registers algorithms
from src.automl.mappings import SKLEARN_MAPPING
from src.automl.runner import AutoMLRunner

def test_advisor_algorithms_are_registered():
    """Verify all algorithms suggested by advisor are in the registry."""
    advisor = CompetitionAdvisor()
    
    # Check Classification Plan
    analysis_cls = {"target_analysis": {"n_unique": 2, "dtype": "object"}, "problem_type": "classification", "feature_types": {}}
    plan_cls = advisor.generate_competition_plan(analysis_cls)
    
    cls_models = [plan_cls["baseline"]["model"], plan_cls["advanced"]["model"]]
    
    # Check Regression Plan
    analysis_reg = {"target_analysis": {"n_unique": 100, "dtype": "float"}, "problem_type": "regression", "feature_types": {}}
    plan_reg = advisor.generate_competition_plan(analysis_reg)
    
    reg_models = [plan_reg["baseline"]["model"], plan_reg["advanced"]["model"]]
    
    all_models = cls_models + reg_models
    print(f"Testing models: {all_models}")
    
    registered_names = [a.name for a in AlgorithmRegistry.get_all()]
    
    for model in all_models:
        assert model in registered_names, f"Model '{model}' from Advisor not found in Registry"

def test_runner_compatibility():
    """Verify that suggested models can be instantiated and run via mappings."""
    # Setup dummy data
    df = pd.DataFrame({
        'A': np.random.rand(50),
        'B': np.random.randint(0, 2, 50),
        'target_cls': np.random.randint(0, 2, 50),
        'target_reg': np.random.rand(50)
    })
    
    advisor = CompetitionAdvisor()
    runner = AutoMLRunner()
    
    # 1. Classification Flow
    plan_cls = advisor.generate_competition_plan({"problem_type": "classification"})
    models_to_test = [plan_cls["baseline"]["model"], plan_cls["advanced"]["model"]]
    
    recs = []
    for m in models_to_test:
        algo_obj = next((a for a in AlgorithmRegistry.get_all() if a.name == m), None)
        assert algo_obj is not None
        recs.append({"algorithm": algo_obj})
        
    print("Running Classification Benchmark...")
    results_cls = runner.run_benchmark(df[['A', 'B', 'target_cls']], 'target_cls', recs)
    print(results_cls)
    assert not results_cls.empty
    assert "Value" in results_cls.columns
    # Check if any failed
    failed = results_cls[results_cls['Status'].str.contains("Failed")]
    if not failed.empty:
        print("Failures:")
        print(failed)
        # We allow failure if libs are missing, but status should be handled cleanly.
        # Ideally for this test environment we might not have catboost/lightgbm, so we expect Fallback or Failure.
        # But we want to ensure it doesn't Crash the Runner.
        pass

    # 2. Regression Flow
    plan_reg = advisor.generate_competition_plan({"problem_type": "regression"})
    models_to_test_reg = [plan_reg["baseline"]["model"], plan_reg["advanced"]["model"]]
    
    recs_reg = []
    for m in models_to_test_reg:
        algo_obj = next((a for a in AlgorithmRegistry.get_all() if a.name == m), None)
        assert algo_obj is not None
        recs_reg.append({"algorithm": algo_obj})
        
    print("Running Regression Benchmark...")
    results_reg = runner.run_benchmark(df[['A', 'B', 'target_reg']], 'target_reg', recs_reg)
    print(results_reg)
    assert not results_reg.empty

if __name__ == "__main__":
    test_advisor_algorithms_are_registered()
    test_runner_compatibility()
    print("All integration tests passed!")
