import pandas as pd

df = pd.read_csv("../dataset/KDDTrain+.txt", header=None)

print("Dataset Loaded Successfully!")
print("Rows, Columns:", df.shape)
print(df.head())