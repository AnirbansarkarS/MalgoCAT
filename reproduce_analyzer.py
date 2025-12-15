import pandas as pd
import numpy as np
import json
from src.analyzer import DatasetAnalyzer

# Create dummy dataframe with mixed types and NaNs
df = pd.DataFrame({
    'A': [1, 2, np.nan, 4],
    'B': ['x', 'y', 'x', 'z'],
    'C': [1.1, 2.2, float('nan'), 4.4]
})

print("Running Analyzer...")
analyzer = DatasetAnalyzer(df, target_column='B')
results = analyzer.analyze()

print("Analysis keys:", results.keys())

try:
    # Try standard json dump to check for numpy/NaN compliance
    json_output = json.dumps(results)
    print("JSON Dump success!")
except TypeError as e:
    print(f"JSON Dump Failed: {e}")
except Exception as e:
    print(f"Other Error: {e}")

# Check specific types
print("DataType of feature_types['numerical']:", type(results['feature_types']['numerical']))
