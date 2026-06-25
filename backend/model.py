from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Simple training data (we will replace with real dataset later)
# Features: [packet_size, duration, src_bytes, dst_bytes]

X = np.array([
    [100, 10, 500, 1000],
    [200, 20, 2000, 3000],
    [50, 5, 100, 200],
    [300, 30, 5000, 6000],
])

y = ["Normal", "DDoS", "Normal", "Brute Force"]

model = RandomForestClassifier()
model.fit(X, y)

def predict_attack(features):
    prediction = model.predict([features])
    return prediction[0]