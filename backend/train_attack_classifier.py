import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# ------------ 1. Load UNSW dataset ----------------
print("[+] Loading UNSW dataset...")

df1 = pd.read_csv("data/unsw_train.csv")
df2 = pd.read_csv("data/unsw_test.csv")
df = pd.concat([df1, df2])

print(f"[+] Loaded {len(df)} rows")

# ------------ 2. Select features ----------------

FEATURES = [
    "dur", "spkts", "dpkts", "sbytes", "dbytes",
    "sttl", "dttl",
    "sload", "dload",
    "sinpkt", "dinpkt",
    "sjit", "djit",
    "tcprtt", "synack", "ackdat",
]

df = df[FEATURES + ["attack_cat"]].dropna()

df["attack_cat"] = df["attack_cat"].astype(str)

X = df[FEATURES]
y = df["attack_cat"]

# ------------ 3. Train-Test Split ----------------
print("[+] Splitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# ------------ 4. Train Model ---------------------
print("[+] Training RandomForest classifier...")

model = RandomForestClassifier(
    n_estimators=400,
    max_depth=None,
    n_jobs=-1,
    random_state=42
)

model.fit(X_train, y_train)

# ------------ 5. Save ----------------------------
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/attack_classifier.pkl")

print("[+] Attack classifier saved successfully!")
