from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier # Simplified XGB substitute for now
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

# Map Algorithm.name -> sklearn class
# Note: For Deep Learning/CNN, we might need PyTorch/TensorFlow, 
# but for MVP we map MLP. CNN is excluded from simple tabular run.
SKLEARN_MAPPING = {
    # Classification
    "Logistic Regression": LogisticRegression,
    "Random Forest": RandomForestClassifier,
    "Gradient Boosting": GradientBoostingClassifier,
    "Decision Tree": DecisionTreeClassifier,
    "Multi-Layer Perceptron (MLP)": MLPClassifier,
    "K-Nearest Neighbors": KNeighborsClassifier,
    "XGBoost": GradientBoostingClassifier, # Fallback to sklearn GBM if XGB not installed or for simplicity
    
    # Regression
    "Linear Regression": LinearRegression,
}
