import pandas as pd
from src.analyzer import DatasetAnalyzer
from src.visualizer import DatasetVisualizer
import json
import os
import numpy as np

def main():
    print("Creating dummy dataset...")
    # Create a dummy dataset for testing
    data = {
        'age': [25, 30, 35, 40, None, 22, 55, 60, 24, 33],
        'salary': [50000, 60000, 75000, None, 80000, 45000, 120000, 130000, 52000, 68000],
        'department': ['HR', 'IT', 'IT', 'HR', 'Finance', 'IT', 'Finance', 'Finance', 'HR', 'IT'],
        'joined_date': pd.to_datetime(['2020-01-01', '2019-05-15', '2021-02-20', '2018-11-10', '2022-01-05', 
                                       '2021-06-01', '2015-03-12', '2010-08-20', '2022-11-01', '2020-09-15']),
        'is_manager': [False, False, True, True, False, False, True, True, False, False],
        'performance_score': [3.5, 4.2, 3.8, 4.5, 3.0, 4.0, 4.8, 4.9, 3.2, 4.1]
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

    print("\nInitializing Visualizer...")
    visualizer = DatasetVisualizer(df, target_column='department')
    
    output_dir = "plots"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Generating plots in '{output_dir}'...")
    visualizer.generate_all_plots(output_dir)
    
    # --- New Phase 2 Demo ---
    from src.algorithms.definitions import register_all_algorithms
    from src.algorithms.registry import AlgorithmRegistry
    
    # Ensure definitions are loaded
    # (In a real app, this might happen in package init)
    
    print("\n--- Phase 2: Algorithm Library ---")
    print("Fetching algorithms from registry...")
    
    classification_algos = AlgorithmRegistry.get_by_type("classification")
    print(f"\nFound {len(classification_algos)} Classification Algorithms:")
    for algo in classification_algos:
        print(f" - {algo.name}: {algo.description[:50]}...")
        
    print("\nExample Detail (Random Forest):")
    rf = AlgorithmRegistry.get_by_name("Random Forest")
    if rf:
        print(json.dumps(rf.to_dict(), indent=2))
        
    # --- New Phase 3 Demo ---
    from src.engine import HeuristicRanker
    
    print("\n--- Phase 3: Heuristic Ranking ---")
    print("Ranking algorithms for this dataset...")
    
    ranker = HeuristicRanker()
    # We use the 'results' dictionary from the earlier analyzer.analyze() call
    recommendations = ranker.rank(results, top_k=3)
    
    print("\nTop 3 Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        algo = rec["algorithm"]
        score = rec["score"]
        reasons = rec["reasons"]
        print(f"{i}. {algo.name} (Score: {score:.1f})")
        print(f"   Why: {', '.join(reasons)}")

    print("\nDone!")

if __name__ == "__main__":
    main()
