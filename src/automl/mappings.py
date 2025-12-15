from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB

# Map Algorithm.name -> sklearn class
# Note: For Deep Learning/CNN, we might need PyTorch/TensorFlow, 
# but for MVP we map MLP. CNN is excluded from simple tabular run.
SKLEARN_MAPPING = {
    # Classification
    "Logistic Regression": LogisticRegression,
    "Random Forest": RandomForestClassifier,
    "Gradient Boosting": GradientBoostingClassifier,
    "AdaBoost": AdaBoostClassifier,
    "Decision Tree": DecisionTreeClassifier,
    "Multi-Layer Perceptron (MLP)": MLPClassifier,
    "K-Nearest Neighbors": KNeighborsClassifier,
    "XGBoost": GradientBoostingClassifier, # Fallback
    "Support Vector Machine (SVM)": SVC,
    "Gaussian Naive Bayes": GaussianNB,
    
    # Regression
    "Linear Regression": LinearRegression,
}
