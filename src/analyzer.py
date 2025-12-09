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
            "imbalance_stats": self._get_imbalance_stats() if self.target_column else None
        }
        return self.analysis_result

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

    def _get_imbalance_stats(self) -> Optional[Dict[str, Any]]:
        """Check for class imbalance if target is categorical."""
        if not self.target_column or self.target_column not in self.df.columns:
            return None
            
        target = self.df[self.target_column]
        if pd.api.types.is_numeric_dtype(target.dtype):
             # For regression, maybe check for skewness later?
             return {"type": "regression (likely)", "skewness": target.skew()}
        
        # Assume classification for non-numeric or low cardinality numeric
        value_counts = target.value_counts(normalize=True)
        return {
            "type": "classification",
            "class_distribution": value_counts.to_dict(),
            "num_classes": len(value_counts),
            "is_imbalanced": any(value_counts < (1.0 / len(value_counts) * 0.5)) # Simple heuristic
        }
