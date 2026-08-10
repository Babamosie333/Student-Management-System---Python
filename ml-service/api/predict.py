"""
predict.py — Vercel Python Serverless Function.

This is the deployed version of the same prediction logic in
../app.py (Flask, used for local dev). Vercel's Python runtime deploys
each file under /api as its own serverless function, using the
BaseHTTPRequestHandler pattern below — no Flask/WSGI needed here, which
keeps the deployed function small and simple.

Once deployed, this function is reachable at /api/predict on the same
domain as the rest of the site (see /vercel.json), so the whole project
— frontend, Node backend, and this Python ML function — deploys as a
single Vercel project.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import joblib
import numpy as np

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


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json(200, {})

    def do_GET(self):
        self._send_json(200, {"status": "ok", "service": "student-performance-ml"})

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length) if content_length else b"{}"
            data = json.loads(raw_body or b"{}")

            attendance = float(data.get("attendancePercentage"))
            marks = float(data.get("averageMarks"))
        except (TypeError, ValueError, json.JSONDecodeError):
            self._send_json(400, {
                "error": "attendancePercentage and averageMarks must be numbers"
            })
            return

        attendance = max(0, min(100, attendance))
        marks = max(0, min(100, marks))

        X = np.array([[attendance, marks]])
        prediction = int(model.predict(X)[0])
        probabilities = model.predict_proba(X)[0]
        confidence = round(float(max(probabilities)) * 100, 2)

        self._send_json(200, {
            "prediction": LABELS[prediction],
            "confidence": confidence,
            "advice": ADVICE[prediction],
            "inputs": {
                "attendancePercentage": attendance,
                "averageMarks": marks,
            }
        })
