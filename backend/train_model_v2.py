import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load Dataset
df = pd.read_csv("../dataset/KDDTrain+.txt", header=None)

# Features (41 columns)
X = df.iloc[:, :-2].copy()

# Target Column
y = df[41]

# Store all feature encoders
encoders = {}

# Encode categorical columns
for col in X.select_dtypes(include=["object"]).columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    encoders[col] = le

# Encode attack labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Accuracy
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Accuracy: {accuracy * 100:.2f}%")

# Save Everything
joblib.dump(model, "../model/attack_model.pkl")
joblib.dump(encoders, "../model/feature_encoders.pkl")
joblib.dump(label_encoder, "../model/target_encoder.pkl")

print("Model Saved Successfully!")
print("Feature Encoders Saved Successfully!")
print("Target Encoder Saved Successfully!")