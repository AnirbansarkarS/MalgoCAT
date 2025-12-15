import pytest
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.competition.advisor import CompetitionAdvisor

def test_time_estimation():
    advisor = CompetitionAdvisor()
    # Small data
    assert "Seconds" in advisor.estimate_time_budget(100, 10, 5)
    # Huge data + High complexity
    assert "Hours" in advisor.estimate_time_budget(100000, 1000, 10)

def test_baseline_suggestion():
    advisor = CompetitionAdvisor()
    assert "Random Forest" in advisor.get_baseline_suggestion("classification")

def test_kaggle_tips():
    advisor = CompetitionAdvisor()
    
    # Case: Missing Values
    analysis_missing = {"missing_stats": {"has_missing_values": True}}
    tips = advisor.get_kaggle_tips(analysis_missing)
    assert any("XGBoost" in t for t in tips)
    
    # Case: Imbalance
    analysis_imbalance = {"imbalance_stats": {"is_imbalanced": True}}
    tips = advisor.get_kaggle_tips(analysis_imbalance)
    assert any("F1" in t for t in tips)
