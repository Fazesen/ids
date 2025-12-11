import pandas as pd

df = pd.read_csv("data/unsw_train.csv", nrows=5)
print(df.columns)
