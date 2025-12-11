import joblib
import numpy as np
import pandas as pd


model = joblib.load("../models/attack_classifier.pkl")

FEATURES = [
    "dur", "spkts", "dpkts", "sbytes", "dbytes",
    "sttl", "dttl", "sload", "dload",
    "sinpkt", "dinpkt", "sjit", "djit",
    "tcprtt", "synack", "ackdat"
]


def classify_attack(features):
    # convert dictionary → DataFrame with correct feature names
    x = pd.DataFrame([[features.get(f, 0) for f in FEATURES]], columns=FEATURES)

    prediction = model.predict(x)[0]
    return prediction
