import pandas as pd
import numpy as np
from typing import List, Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from src.automl.mappings import SKLEARN_MAPPING

class AutoMLRunner:
    """
    Executes the recommended algorithms and benchmarks them.
    """
    
    def run_benchmark(self, df: pd.DataFrame, target_col: str, recommendations: List[Any]) -> pd.DataFrame:
        """
        Runs the benchmark loop.
        
        Args:
            df: Dataset.
            target_col: Target column name.
            recommendations: List of recommendation dicts from HeuristicRanker.
            
        Returns:
            DataFrame with columns [Algorithm, Metric, Value, Status]
        """
        results = []
        
        # 1. Preprocessing (Minimal)
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        # Handle Missing Values (Simple Mean/Mode Imputation)
        # Numerical
        num_cols = X.select_dtypes(include=[np.number]).columns
        if len(num_cols) > 0:
            imputer_num = SimpleImputer(strategy='mean')
            X[num_cols] = imputer_num.fit_transform(X[num_cols])
            
        # Categorical -> Label Encode for simplicity (or OneHot)
        cat_cols = X.select_dtypes(exclude=[np.number]).columns
        for col in cat_cols:
            le = LabelEncoder()
            # Handle potential new categories in future/test by using str conversion
            X[col] = le.fit_transform(X[col].astype(str))
            
        # Target Encoding if categorical
        is_classification = False
        if y.dtype == 'object' or len(y.unique()) < 20:
            is_classification = True
            le_y = LabelEncoder()
            y = le_y.fit_transform(y)
            
        # 2. Train/Test Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scaling (Important for KNN, MLP, Linear)
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_test = scaler.transform(X_test)
        
        # 3. Benchmark Loop
        for rec in recommendations:
            algo = rec["algorithm"]
            model_class = SKLEARN_MAPPING.get(algo.name)
            
            if not model_class:
                results.append({"Algorithm": algo.name, "Metric": "N/A", "Value": 0.0, "Status": "Not Implemented"})
                continue
                
            try:
                # Instantiate
                model = model_class()
                
                # Train
                model.fit(X_train, y_train)
                
                # Predict
                y_pred = model.predict(X_test)
                
                # Evaluate
                if is_classification:
                    score = accuracy_score(y_test, y_pred)
                    metric_name = "Accuracy"
                else:
                    score = r2_score(y_test, y_pred) # or RMSE
                    metric_name = "R2 Score"
                    
                results.append({"Algorithm": algo.name, "Metric": metric_name, "Value": score, "Status": "Success"})
                
            except Exception as e:
                results.append({"Algorithm": algo.name, "Metric": "Error", "Value": 0.0, "Status": f"Failed: {str(e)}"})
                
        return pd.DataFrame(results).sort_values(by="Value", ascending=False)
