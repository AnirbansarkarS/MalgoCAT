from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier, VotingClassifier, StackingRegressor, RandomForestRegressor
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
import sys

# Conditional Imports to avoid crashing if libs are missing
try:
    from xgboost import XGBClassifier, XGBRegressor
except ImportError:
    XGBClassifier = GradientBoostingClassifier
    XGBRegressor = RandomForestRegressor
    print("Warning: XGBoost not found, using sklearn fallback.", file=sys.stderr)

try:
    from lightgbm import LGBMClassifier, LGBMRegressor
except ImportError:
    LGBMClassifier = GradientBoostingClassifier
    LGBMRegressor = RandomForestRegressor
    print("Warning: LightGBM not found, using sklearn fallback.", file=sys.stderr)

try:
    from catboost import CatBoostClassifier
    # CatBoostRegressor not used yet but good to know
except ImportError:
    CatBoostClassifier = GradientBoostingClassifier
    print("Warning: CatBoost not found, using sklearn fallback.", file=sys.stderr)


# Factory functions for complex ensembles
def create_voting_classifier():
    return VotingClassifier(
        estimators=[
            ('xgb', XGBClassifier(n_estimators=100, use_label_encoder=False, eval_metric='logloss')),
            ('lgb', LGBMClassifier(n_estimators=100)),
            ('rf', RandomForestClassifier(n_estimators=100))
        ],
        voting='soft'
    )

def create_stacked_regressor():
    return StackingRegressor(
        estimators=[
            ('xgb', XGBRegressor(n_estimators=100)),
            ('lgb', LGBMRegressor(n_estimators=100))
        ],
        final_estimator=LinearRegression()
    )

def create_ensemble_classifier():
    # Matches "Ensemble (XGB + CatBoost + LGBM)"
    estimators = [
        ('xgb', XGBClassifier(use_label_encoder=False, eval_metric='logloss')),
        ('lgb', LGBMClassifier()),
    ]
    # Only add catboost if available (it might be the fallback GB, checking class name/module might be safer but this is MVP)
    # If CatBoostClassifier is actually GradientBoostingClassifier (fallback), we might duplicate.
    # But it's fine for now.
    estimators.append(('cat', CatBoostClassifier(verbose=0) if 'catboost' in sys.modules else GradientBoostingClassifier()))
    
    return VotingClassifier(estimators=estimators, voting='soft')

# Map Algorithm.name -> sklearn class OR factory function
SKLEARN_MAPPING = {
    # Classification
    "Logistic Regression": LogisticRegression,
    "Random Forest": RandomForestClassifier,
    "Gradient Boosting": GradientBoostingClassifier,
    "AdaBoost": AdaBoostClassifier,
    "Decision Tree": DecisionTreeClassifier,
    "Multi-Layer Perceptron (MLP)": MLPClassifier,
    "K-Nearest Neighbors": KNeighborsClassifier,
    "XGBoost": XGBClassifier,
    "Support Vector Machine (SVM)": SVC,
    "Gaussian Naive Bayes": GaussianNB,
    "LightGBM Classifier": LGBMClassifier,
    "CatBoost Classifier": CatBoostClassifier,
    "Voting Classifier": create_voting_classifier,
    "Ensemble (XGB + CatBoost + LGBM)": create_ensemble_classifier,
    
    # Regression
    "Linear Regression": LinearRegression,
    "XGBoost Regressor": XGBRegressor,
    "LightGBM Regressor": LGBMRegressor,
    "Stacked Regressor": create_stacked_regressor,
    "Stacked Regressors": create_stacked_regressor, # Alias
}
