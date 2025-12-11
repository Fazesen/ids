import json
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

def load_live_data(path="data/flow_features.jsonl"):
    X = []
    with open(path, "r") as f:
        for line in f:
            sample = json.loads(line)
            X.append([
                sample["duration"],
                sample["packet_count"],
                sample["bytes"],
                sample["avg_pkt_size"],
                sample["std_pkt_size"],
                sample["mean_iat"],
                sample["entropy"],
                sample["flag_count"]
            ])
    return np.array(X)

print("[+] Loading live flow dataset...")
X = load_live_data()

print("[+] Training Isolation Forest on LIVE features...")
model = IsolationForest(
    n_estimators=150,
    contamination=0.02,
    random_state=42
)

model.fit(X)

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/isoforest_live.pkl")

print("[+] Model trained & saved as isoforest_live.pkl!")
