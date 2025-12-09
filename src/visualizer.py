import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
from typing import Optional

class DatasetVisualizer:
    """
    Generates visualizations for the dataset analysis.
    """
    
    def __init__(self, df: pd.DataFrame, target_column: Optional[str] = None):
        self.df = df
        self.target_column = target_column
        # Set style
        sns.set_theme(style="whitegrid")

    def _save_plot(self, fig, filename: str, output_dir: str):
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            path = os.path.join(output_dir, filename)
            fig.savefig(path, bbox_inches='tight')
            plt.close(fig)
            return path
        return None

    def plot_target_distribution(self, output_dir: Optional[str] = None):
        """Plots the distribution of the target variable."""
        if not self.target_column or self.target_column not in self.df.columns:
            return None

        target = self.df[self.target_column]
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if pd.api.types.is_numeric_dtype(target.dtype) and target.nunique() > 20:
            # Regression check - Histogram
            sns.histplot(target, kde=True, ax=ax)
            ax.set_title(f"Distribution of Target: {self.target_column}")
        else:
            # Classification - Bar chart
            sns.countplot(x=target, ax=ax)
            ax.set_title(f"Class Distribution: {self.target_column}")
        
        return self._save_plot(fig, "target_distribution.png", output_dir)

    def plot_correlation_heatmap(self, output_dir: Optional[str] = None):
        """Plots correlation heatmap for numerical features."""
        numeric_df = self.df.select_dtypes(include=['number'])
        if numeric_df.shape[1] < 2:
            return None

        fig, ax = plt.subplots(figsize=(12, 10))
        corr = numeric_df.corr()
        sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f", ax=ax)
        ax.set_title("Feature Correlation Matrix")
        
        return self._save_plot(fig, "correlation_heatmap.png", output_dir)

    def plot_missing_matrix(self, output_dir: Optional[str] = None):
        """Visualizes missing values."""
        if not self.df.isna().any().any():
            return None
            
        fig, ax = plt.subplots(figsize=(12, 8))
        sns.heatmap(self.df.isna(), cbar=False, cmap='viridis', ax=ax)
        ax.set_title("Missing Values Matrix")
        
        return self._save_plot(fig, "missing_matrix.png", output_dir)

    def generate_all_plots(self, output_dir: str):
        """Generates and saves all available plots."""
        print(f"Generating plots in {output_dir}...")
        self.plot_target_distribution(output_dir)
        self.plot_correlation_heatmap(output_dir)
        self.plot_missing_matrix(output_dir)
