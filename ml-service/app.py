"""
app.py — Python ML microservice.

Exposes one endpoint that the Node/Express backend calls to get a
student's predicted performance band based on attendance % and
average marks. This is a separate small service (a "polyglot
microservice" architecture) — Node/Express stays the main backend and
talks to MongoDB, this service only does the ML part.

Run:
    python app.py
Runs on http://localhost:5001 by default.
"""

from flask import Flask, request, jsonify
import joblib
import os
import numpy as np

app = Flask(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(MODEL_PATH)

LABELS = {
    0: "Fail",
    1: "At Risk",
    2: "Pass",
}

ADVICE = {
    0: "Attendance and/or marks are critically low. Immediate attention needed — talk to a teacher and create a catch-up plan.",
    1: "Performance is borderline. Improving attendance and revising weak subjects can move this into a safe zone.",
    2: "On track. Keep up consistent attendance and study habits.",
}


# Manual CORS handling (no flask-cors dependency needed) so the React
# frontend / Node backend can call this service directly in dev if needed.
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    return response


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "student-performance-ml"})


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}

    try:
        attendance = float(data.get("attendancePercentage"))
        marks = float(data.get("averageMarks"))
    except (TypeError, ValueError):
        return jsonify({
            "error": "attendancePercentage and averageMarks must be numbers"
        }), 400

    attendance = max(0, min(100, attendance))
    marks = max(0, min(100, marks))

    X = np.array([[attendance, marks]])
    prediction = int(model.predict(X)[0])
    probabilities = model.predict_proba(X)[0]

    confidence = round(float(max(probabilities)) * 100, 2)

    return jsonify({
        "prediction": LABELS[prediction],
        "confidence": confidence,
        "advice": ADVICE[prediction],
        "inputs": {
            "attendancePercentage": attendance,
            "averageMarks": marks,
        }
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
