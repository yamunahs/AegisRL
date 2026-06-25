import pandas as pd

df = pd.read_csv("../dataset/KDDTrain+.txt", header=None)

attacks = df[41].value_counts()

stats = {
    "total_records": len(df),
    "normal": int(attacks.get("normal", 0)),
    "neptune": int(attacks.get("neptune", 0)),
    "satan": int(attacks.get("satan", 0))
}

print(stats)