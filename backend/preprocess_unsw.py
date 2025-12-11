import pandas as pd
import numpy as np

# Keep only features that exist in UNSW
FEATURES_TO_KEEP = [
    "dur", "spkts", "dpkts", "sbytes", "dbytes",
    "sttl", "dttl", "sload", "dload", "sloss", "dloss",
    "sinpkt", "dinpkt", "sjit", "djit",
    "swin", "dwin", "tcprtt", "synack", "ackdat",
]

LABEL = "label"   # 0 = normal, 1 = attack

def load_unsw(train_path="data/unsw_train.csv"):
    df = pd.read_csv(train_path)

    # Select features + label
    df = df[FEATURES_TO_KEEP + [LABEL]]

    # Replace infinities, fill NaN
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)

    # Convert numeric label to string classes
    df[LABEL] = df[LABEL].apply(lambda x: "normal" if x == 0 else "attack")

    return df
