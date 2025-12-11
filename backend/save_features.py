import json
import os

def save_feature_vector(vector, filename="data/flow_features.jsonl"):
    # Ensure data directory exists
    os.makedirs("data", exist_ok=True)
    
    with open(filename, "a") as f:
        f.write(json.dumps(vector) + "\n")
