import pandas as pd
from src.analyzer import DatasetAnalyzer
import json

def main():
    print("Creating dummy dataset...")
    # Create a dummy dataset
    data = {
        'age': [25, 30, 35, 40, None],
        'salary': [50000, 60000, 75000, None, 80000],
        'department': ['HR', 'IT', 'IT', 'HR', 'Finance'],
        'joined_date': pd.to_datetime(['2020-01-01', '2019-05-15', '2021-02-20', '2018-11-10', '2022-01-05']),
        'is_manager': [False, False, True, True, False]
    }
    df = pd.DataFrame(data)
    
    print("\nDataset Preview:")
    print(df.head())
    
    print("\nInitializing Analyzer...")
    analyzer = DatasetAnalyzer(df, target_column='department')
    
    print("Running Analysis...")
    results = analyzer.analyze()
    
    print("\nAnalysis Results:")
    print(json.dumps(results, indent=2, default=str))

if __name__ == "__main__":
    main()
