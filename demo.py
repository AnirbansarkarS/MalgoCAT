import pandas as pd
from src.analyzer import DatasetAnalyzer
from src.visualizer import DatasetVisualizer
import json
import os
import numpy as np

def main():
    print("Creating dummy dataset...")
    # Create a dummy dataset with more complexity for testing
    data = {
        'age': [25, 30, 35, 40, None, 22, 55, 60, 24, 33],
        'salary': [50000, 60000, 75000, None, 80000, 45000, 120000, 130000, 52000, 68000],
        'department': ['HR', 'IT', 'IT', 'HR', 'Finance', 'IT', 'Finance', 'Finance', 'HR', 'IT'],
        'joined_date': pd.to_datetime(['2020-01-01', '2019-05-15', '2021-02-20', '2018-11-10', '2022-01-05', 
                                       '2021-06-01', '2015-03-12', '2010-08-20', '2022-11-01', '2020-09-15']),
        'is_manager': [False, False, True, True, False, False, True, True, False, False],
        'performance_score': [3.5, 4.2, 3.8, 4.5, 3.0, 4.0, 4.8, 4.9, 3.2, 4.1]
    }
    # Add some correlation: older people tend to have higher salary
    
    df = pd.DataFrame(data)
    
    print("\nDataset Preview:")
    print(df.head())
    
    print("\nInitializing Analyzer...")
    analyzer = DatasetAnalyzer(df, target_column='department')
    
    print("Running Analysis...")
    results = analyzer.analyze()
    
    print("\nAnalysis Results:")
    print(json.dumps(results, indent=2, default=str))

    print("\nInitializing Visualizer...")
    visualizer = DatasetVisualizer(df, target_column='department')
    
    output_dir = "plots"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Generating plots in '{output_dir}'...")
    visualizer.generate_all_plots(output_dir)
    print("Done!")

if __name__ == "__main__":
    main()
