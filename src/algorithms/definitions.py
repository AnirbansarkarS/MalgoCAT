from src.algorithms.base import Algorithm
from src.algorithms.registry import AlgorithmRegistry

def register_all_algorithms():
    """ Registers all standard algorithms into the registry. """
    
    # --- Linear Models ---
    AlgorithmRegistry.register(Algorithm(
        name="Logistic Regression",
        type="classification",
        description="A statistical model that uses a logistic function to model a binary dependent variable.",
        pros=["Simple and Interpretable", "Fast Training", "Good baseline"],
        cons=["Assumes linear boundary", "Sensitive to outliers", "Cannot handle complex relationships"],
        complexity_score=2,
        handle_sparse=True
    ))

    AlgorithmRegistry.register(Algorithm(
        name="Linear Regression",
        type="regression",
        description="Models the relationship between a scalar response and one or more explanatory variables using a linear equation.",
        pros=["Simple and Interpretable", "Fast", "No hyperparameter tuning needed (usually)"],
        cons=["Assumes linear relationship", "Sensitive to outliers"],
        complexity_score=1,
        handle_sparse=True
    ))

    # --- Tree-based Models ---
    AlgorithmRegistry.register(Algorithm(
        name="Random Forest",
        type="classification",
        description="An ensemble learning method that fits a number of decision tree classifiers on various sub-samples of the dataset.",
        pros=["Robust to overfitting", "Handles non-linear data", "Handles outliers well"],
        cons=["Slow prediction", "Hard to interpret", "Large model size"],
        complexity_score=5,
        handle_missing=True, # Often implementations like sklearn require imputation, but conceptually yes
        handle_categorical=False # sklearn implementation requires encoding
    ))
    
    AlgorithmRegistry.register(Algorithm(
        name="XGBoost",
        type="classification",
        description="Optimized distributed gradient boosting library designed to be highly efficient, flexible and portable.",
        pros=["State-of-the-art performance", "Handles missing values", "Regularization built-in"],
        cons=["Many hyperparameters", "Can overfit if not tuned"],
        complexity_score=7,
        handle_missing=True,
        handle_sparse=True
    ))

    # --- Neural Networks & Deep Learning ---
    AlgorithmRegistry.register(Algorithm(
        name="Multi-Layer Perceptron (MLP)",
        type="classification",
        description="A class of feedforward artificial neural network. An MLP consists of at least three layers of nodes: an input layer, a hidden layer and an output layer.",
        pros=["Can learn complex non-linear relationships", "Flexible architecture"],
        cons=["Requires large data", "Hard to interpret", "Computationally expensive", "Sensitive to scaling"],
        complexity_score=8,
        min_samples=1000
    ))
    
    AlgorithmRegistry.register(Algorithm(
        name="Convolutional Neural Network (CNN)",
        type="classification", 
        description="A deep learning algorithm which can take in an input image, assign importance to various aspects/objects in the image and be able to differentiate one from the other.",
        pros=["Excellent at spatial pattern recognition (Images)", "Parameter sharing"],
        cons=["Computationally very expensive", "Requires GPU", "Black box"],
        complexity_score=9,
        min_samples=2000
    ))

    # --- Support Vector Machines ---
    AlgorithmRegistry.register(Algorithm(
        name="Support Vector Machine (SVM)",
        type="classification",
        description="Finds the hyperplane that best separates classes with the maximum margin.",
        pros=["Effective in high dimensional spaces", "Versatile kernels"],
        cons=["Not suitable for large datasets", "Sensitive to noise", "Requires feature scaling"],
        complexity_score=6,
        handle_sparse=False # sklearn requires dense for some kernels, typically needs scaling
    ))

    # --- Naive Bayes ---
    AlgorithmRegistry.register(Algorithm(
        name="Gaussian Naive Bayes",
        type="classification",
        description="Probabilistic classifier based on Bayes' theorem with the assumption of independence between features.",
        pros=["Extremely fast", "Simple", "Good for text/high-dim"],
        cons=["Assumes feature independence (rarely true)", "Can be outperformed by complex models"],
        complexity_score=1,
        min_samples=10
    ))
    
    # --- Boosting ---
    AlgorithmRegistry.register(Algorithm(
        name="AdaBoost",
        type="classification",
        description="An iterative ensemble method that adjusts weights of incorrectly classified instances so that subsequent classifiers focus on difficult cases.",
        pros=["Less prone to overfitting than some", "Easy to implement"],
        cons=["Sensitive to noisy data and outliers"],
        complexity_score=4
    ))
    
    # --- Others ---
    AlgorithmRegistry.register(Algorithm(
        name="K-Nearest Neighbors",
        type="classification",
        description="Non-parametric method where the input consists of the k closest training examples in the feature space.",
        pros=["Simple", "No training phase"],
        cons=["Slow prediction", "Sensitive to noise", "Curse of dimensionality"],
        complexity_score=3
    ))

# Call this function to initialize registry (usually in __init__)
register_all_algorithms()
