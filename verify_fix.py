import pandas as pd
import numpy as np
import json
from src.analyzer import DatasetAnalyzer
from src.api.main import json_safe

# Create dummy dataframe with mixed types and NaNs
df = pd.DataFrame({
    'col1': [1, 2, np.nan, 4],
    'col2': ['x', 'y', 'x', 'z'],
    'col3': [1.1, 2.2, float('nan'), 4.4]
})

print("Running Analyzer...")
analyzer = DatasetAnalyzer(df, target_column='col1')
results = analyzer.analyze()

print("Checking 'feature_columns'...")
if "feature_columns" in results:
    print("Found 'feature_columns':", results["feature_columns"])
else:
    print("MISSING 'feature_columns'!")

print("Testing json_safe serialization...")
try:
    safe_results = json_safe(results)
    json_output = json.dumps(safe_results)
    print("JSON Dump success!")
    
    # Check if NaN preserved as None (null in json)
    if "col1" in str(json_output):
        print("Output contains column names")
        
except Exception as e:
    print(f"Serialization Failed: {e}")
