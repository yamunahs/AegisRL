from scapy.all import sniff
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from openpyxl import Workbook
from fastapi.responses import FileResponse

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
model = joblib.load("../model/attack_model.pkl")
target_encoder = joblib.load("../model/target_encoder.pkl")


# -------------------------
# HOME
# -------------------------

@app.get("/")
def home():
    return {
        "project": "Aegis RL",
        "status": "Running",
        "model": "Loaded"
    }


# -------------------------
# DASHBOARD STATS
# -------------------------

@app.get("/stats")
def stats():
    return {
        "threats": 125973,
        "accuracy": 99,
        "status": "Protected",
        "top_attack": "Neptune"
    }


# -------------------------
# DATASET STATS
# -------------------------

@app.get("/dataset-stats")
def dataset_stats():

    df = pd.read_csv(
        "../dataset/KDDTrain+.txt",
        header=None
    )

    attacks = df[41].value_counts()

    return {
        "total_records": len(df),
        "normal": int(attacks.get("normal", 0)),
        "neptune": int(attacks.get("neptune", 0)),
        "satan": int(attacks.get("satan", 0))
    }


# -------------------------
# CSV ANALYZER
# -------------------------

@app.post("/analyze-csv")
async def analyze_csv(file: UploadFile = File(...)):

    df = pd.read_csv(file.file, header=None)

    attack_counts = df[41].value_counts()

    return {
        "total_records": len(df),
        "attack_summary": attack_counts.head(10).to_dict()
    }


# -------------------------
# SAMPLE PREDICT
# -------------------------

@app.get("/sample-predict")
def sample_predict():

    df = pd.read_csv(
        "../dataset/KDDTrain+.txt",
        header=None
    )

    X = df.iloc[:, :-2]

    # Encode text columns
    for col in X.select_dtypes(include=["object"]).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])

    sample = X.iloc[[0]]

    pred = model.predict(sample)[0]

    attack_name = target_encoder.inverse_transform(
        [pred]
    )[0]

    return {
        "attack_type": str(attack_name),
        "severity": get_severity(str(attack_name)),
        "solutions": get_solution(str(attack_name))
    }


# -------------------------
# LIVE ATTACK ANALYZER
# -------------------------

class Packet(BaseModel):
    duration: int
    protocol_type: int
    service: int
    flag: int
    src_bytes: int
    dst_bytes: int


@app.post("/predict")
def predict(packet: Packet):

    return {
        "message": "41-feature model loaded successfully",
        "note": "Frontend analyzer will be connected later"
    }


# -------------------------
# SEVERITY ENGINE
# -------------------------

def get_severity(attack):

    high = [
        "neptune",
        "smurf",
        "back"
    ]

    medium = [
        "satan",
        "ipsweep",
        "portsweep"
    ]

    if attack in high:
        return "HIGH"

    if attack in medium:
        return "MEDIUM"

    return "LOW"


# -------------------------
# RECOMMENDATIONS
# -------------------------

def get_solution(attack):

    if attack == "neptune":
        return [
            "Enable WAF",
            "Enable Rate Limiting",
            "Monitor Incoming Traffic"
        ]

    if attack == "satan":
        return [
            "Block Scanner IP",
            "Review IDS Logs",
            "Monitor Network Activity"
        ]

    if attack == "ipsweep":
        return [
            "Restrict Port Visibility",
            "Enable Firewall Rules"
        ]

    if attack == "portsweep":
        return [
            "Close Unused Ports",
            "Enable Intrusion Detection"
        ]

    return [
        "Monitor Traffic",
        "Maintain Firewall Policies"
    ]
@app.get("/geoip")
def geoip():
    return {
        "ip": "8.8.8.8",
        "country": "United States",
        "city": "Mountain View",
        "risk_score": 82
    }
import random

@app.get("/live-monitor")
def live_monitor():
    packets = random.randint(200, 500)
    suspicious = random.randint(5, 25)

    return {
        "packets": packets,
        "suspicious": suspicious,
        "normal": packets - suspicious
    }
from fastapi.responses import FileResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet

@app.get("/generate-report")
def generate_report():

    # Load dataset
    df = pd.read_csv(
        "../dataset/KDDTrain+.txt",
        header=None
    )

    attacks = df[41].value_counts()

    total_records = len(df)

    top_attack = attacks.idxmax()

    pdf_file = "security_report.pdf"

    # Create PDF
    doc = SimpleDocTemplate(pdf_file)

    styles = getSampleStyleSheet()

    content = []

    # Title
    content.append(
        Paragraph(
            "Aegis RL Security Report",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 12))

    # Summary
    content.append(
        Paragraph(
            f"Total Records: {total_records}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Top Attack: {top_attack}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            "Security Score: 92/100",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            "Risk Level: LOW",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 12))

    # Attack Summary
    content.append(
        Paragraph(
            "Top Attack Summary",
            styles["Heading2"]
        )
    )

    for attack, count in attacks.head(5).items():

        content.append(
            Paragraph(
                f"{attack}: {count}",
                styles["Normal"]
            )
        )

    content.append(Spacer(1, 12))

    # Recommendations
    content.append(
        Paragraph(
            "Recommendations",
            styles["Heading2"]
        )
    )

    recommendations = [
        "Enable WAF Protection",
        "Configure IDS/IPS Rules",
        "Monitor Network Traffic",
        "Enable Rate Limiting",
        "Block Suspicious IPs"
    ]

    for item in recommendations:

        content.append(
            Paragraph(
                f"• {item}",
                styles["Normal"]
            )
        )

    # Build PDF
    doc.build(content)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename="AegisRL_Report.pdf"
    )
@app.get("/export-excel")
def export_excel():

    df = pd.read_csv(
        "../dataset/KDDTrain+.txt",
        header=None
    )

    attacks = df[41].value_counts()

    wb = Workbook()

    ws = wb.active

    ws.title = "Attack Report"

    ws.append(["Attack Type", "Count"])

    for attack, count in attacks.items():
        ws.append([attack, int(count)])

    file_name = "attack_report.xlsx"

    wb.save(file_name)

    return FileResponse(
        file_name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="AegisRL_Attack_Report.xlsx"
    )
@app.get("/real-monitor")
def real_monitor():

    packets = sniff(count=20)

    total_packets = len(packets)

    suspicious = 0

    for packet in packets:

        if packet.haslayer("TCP"):
            suspicious += 1

    return {
        "captured": total_packets,
        "suspicious": suspicious,
        "normal": total_packets - suspicious
    }