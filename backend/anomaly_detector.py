import joblib
import numpy as np

# Load the trained model
model = joblib.load("models/attack_classifier.pkl")


def predict_anomaly(features):
    data = np.array([
        features["duration"],
        features["packet_count"],
        features["bytes"],
        features["avg_pkt_size"],
        features["std_pkt_size"],
        features["mean_iat"],
        features["entropy"],
        features["flag_count"]
    ]).reshape(1, -1)

    # Isolation Forest scores
    score = model.decision_function(data)[0]
    prediction = model.predict(data)[0]  # -1 anomaly, 1 normal

    return {
        "prediction": "ANOMALY" if prediction == -1 else "NORMAL",
        "score": float(score)
    }
