import pandas as pd
import numpy as np
from typing import Dict, Any, Optional

class DatasetAnalyzer:
    """
    Analyzes a pandas DataFrame to extract metadata, feature types, and statistics
    that can be used to recommend ML algorithms.
    """
    
    def __init__(self, df: pd.DataFrame, target_column: Optional[str] = None):
        """
        Initialize the analyzer with a dataframe.
        
        Args:
            df: The pandas DataFrame to analyze
            target_column: The name of the target variable column (optional)
        """
        self.df = df
        self.target_column = target_column
        self.analysis_result = {}

    def analyze(self) -> Dict[str, Any]:
        """
        Perform full analysis of the dataset.
        
        Returns:
            Dictionary containing dataset fingerprints and statistics.
        """
        self.analysis_result = {
            "basic_stats": self._get_basic_stats(),
            "feature_types": self._get_feature_types(),
            "missing_stats": self._get_missing_stats(),
            "imbalance_stats": self._get_imbalance_stats() if self.target_column else None,
            "skewness": self._get_skewness(),
            "correlations": self._get_correlations(),
            "outliers": self._get_outlier_stats()
        }
        
        # Enrich target analysis with type detection if not just basic imbalance
        if self.target_column:
             target_type_info = self._detect_target_type()
             if self.analysis_result["imbalance_stats"]:
                 self.analysis_result["imbalance_stats"].update(target_type_info)
             else:
                 self.analysis_result["imbalance_stats"] = target_type_info

        # Add feature columns explicitly for frontend Mapping
        self.analysis_result["feature_columns"] = self._get_feature_columns()

        return self.analysis_result

    def _get_feature_columns(self) -> Dict[str, list]:
        """Get list of column names for each type."""
        dtypes = self.df.dtypes
        return {
            "numerical": [col for col, t in dtypes.items() if pd.api.types.is_numeric_dtype(t)],
            "categorical": [col for col, t in dtypes.items() if pd.api.types.is_object_dtype(t) or pd.api.types.is_categorical_dtype(t)],
            "datetime": [col for col, t in dtypes.items() if pd.api.types.is_datetime64_any_dtype(t)],
            "bool": [col for col, t in dtypes.items() if pd.api.types.is_bool_dtype(t)]
        }

    def _get_basic_stats(self) -> Dict[str, Any]:
        """Extract basic dimensions and memory usage."""
        return {
            "n_rows": self.df.shape[0],
            "n_columns": self.df.shape[1],
            "memory_usage_mb": self.df.memory_usage(deep=True).sum() / 1024**2,
            "is_empty": self.df.empty
        }

    def _get_feature_types(self) -> Dict[str, int]:
        """Identify counts of different feature types."""
        dtypes = self.df.dtypes
        return {
            "numerical": int(sum(pd.api.types.is_numeric_dtype(t) for t in dtypes)),
            "categorical": int(sum(pd.api.types.is_object_dtype(t) or pd.api.types.is_categorical_dtype(t) for t in dtypes)),
            "datetime": int(sum(pd.api.types.is_datetime64_any_dtype(t) for t in dtypes)),
            "bool": int(sum(pd.api.types.is_bool_dtype(t) for t in dtypes))
        }

    def _get_missing_stats(self) -> Dict[str, Any]:
        """Analyze missing values."""
        total_cells = self.df.size
        missing_cells = self.df.isna().sum().sum()
        columns_with_missing = self.df.columns[self.df.isna().any()].tolist()
        
        return {
            "total_missing": int(missing_cells),
            "missing_ratio": float(missing_cells / total_cells) if total_cells > 0 else 0.0,
            "columns_with_missing": columns_with_missing,
            "has_missing_values": missing_cells > 0
        }
    
    def _get_skewness(self) -> Dict[str, float]:
        """Calculate skewness for numerical columns."""
        numeric_df = self.df.select_dtypes(include=[np.number])
        if numeric_df.empty:
            return {}
        return numeric_df.skew().to_dict()

    def _get_correlations(self) -> Dict[str, Dict[str, float]]:
        """Calculate Pearson correlation matrix for numerical columns."""
        numeric_df = self.df.select_dtypes(include=[np.number])
        if numeric_df.empty or numeric_df.shape[1] < 2:
            return {}
        return numeric_df.corr().to_dict()

    def _get_outlier_stats(self) -> Dict[str, int]:
         """Detect outliers using IQR method for numerical columns."""
         numeric_df = self.df.select_dtypes(include=[np.number])
         outliers = {}
         for col in numeric_df.columns:
             Q1 = numeric_df[col].quantile(0.25)
             Q3 = numeric_df[col].quantile(0.75)
             IQR = Q3 - Q1
             lower_bound = Q1 - 1.5 * IQR
             upper_bound = Q3 + 1.5 * IQR
             count = ((numeric_df[col] < lower_bound) | (numeric_df[col] > upper_bound)).sum()
             if count > 0:
                 outliers[col] = int(count)
         return outliers

    def _detect_target_type(self) -> Dict[str, Any]:
        """
        Sophisticated logic to detect if target is regression, classification (binary/multi), or other.
        """
        if not self.target_column or self.target_column not in self.df.columns:
            return {}
            
        target = self.df[self.target_column]
        distinct_count = target.nunique()
        is_numeric = pd.api.types.is_numeric_dtype(target.dtype)
        
        # Heuristics
        if not is_numeric:
            return {"problem_type": "classification", "sub_type": "binary" if distinct_count == 2 else "multiclass"}
        
        # It is numeric. Is it regression or classification?
        # If float with decimals -> Regression
        # If integer but few unique values -> Classification (likely ordinal or class labels)
        
        # Check if values are essentially integers
        is_integer_like = np.array_equal(target.dropna(), target.dropna().astype(int))
        
        if is_integer_like and distinct_count < 20: # Threshold of 20 unique values for classification hint
             return {"problem_type": "classification", "sub_type": "multiclass", "note": "Numeric target with low cardinality"}
        
        return {"problem_type": "regression"}

    def _get_imbalance_stats(self) -> Optional[Dict[str, Any]]:
        """Check for class imbalance if target is categorical."""
        if not self.target_column or self.target_column not in self.df.columns:
            return None
            
        target = self.df[self.target_column]
        # We will let _detect_target_type handle the high level type, 
        # but if it IS classification, we want distribution.
        
        # Re-using the logic slightly here or trusting the basic check needed for stats
        
        is_numeric = pd.api.types.is_numeric_dtype(target.dtype)
        distinct_count = target.nunique()

        # If it looks like regression, return skewness
        if is_numeric and distinct_count > 20:
             return {"type": "regression", "skewness": target.skew()}
        
        # Assume classification
        value_counts = target.value_counts(normalize=True)
        return {
            "type": "classification",
            "class_distribution": value_counts.to_dict(),
            "num_classes": len(value_counts),
            "is_imbalanced": any(value_counts < (1.0 / len(value_counts) * 0.5)) # Simple heuristic
        }
