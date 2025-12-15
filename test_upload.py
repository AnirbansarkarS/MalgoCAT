import requests
import pandas as pd
import io

# Create a dummy CSV
csv_content = """col1,col2,col3
1,2,3
4,5,6
"""
dummy_file = io.BytesIO(csv_content.encode('utf-8'))

url = "http://localhost:8000/analyze"
files = {"file": ("test.csv", dummy_file, "text/csv")}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
