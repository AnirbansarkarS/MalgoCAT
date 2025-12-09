import pytest
import sys
import os

# Ensure src is in path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.algorithms.base import Algorithm
from src.algorithms.registry import AlgorithmRegistry
import src.algorithms.definitions # Triggers registration

def test_registry_registration():
    # Test manual registration
    algo = Algorithm(
        name="Test Algo",
        type="test_type",
        description="test",
        pros=[],
        cons=[],
        complexity_score=1
    )
    AlgorithmRegistry.register(algo)
    assert AlgorithmRegistry.get_by_name("Test Algo") == algo

def test_get_by_type():
    # Assuming definitions.py has run
    clf_algos = AlgorithmRegistry.get_by_type("classification")
    assert len(clf_algos) > 0
    # Check for known algorithm
    assert any(algo.name == "Random Forest" for algo in clf_algos)

def test_algorithm_structure():
    rf = AlgorithmRegistry.get_by_name("Random Forest")
    assert rf is not None
    assert rf.complexity_score == 5
    assert "Robust to overfitting" in rf.pros

def test_neural_networks_existence():
    mlp = AlgorithmRegistry.get_by_name("Multi-Layer Perceptron (MLP)")
    cnn = AlgorithmRegistry.get_by_name("Convolutional Neural Network (CNN)")
    assert mlp is not None
    assert cnn is not None
    assert mlp.complexity_score >= 8
