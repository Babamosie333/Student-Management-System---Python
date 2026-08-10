# ml-service — Student Performance Prediction (Python)

A small Python microservice, separate from the Node/Express backend,
that predicts whether a student is on track to **Pass**, is **At Risk**,
or likely to **Fail**, based on:

- attendance percentage
- average marks obtained so far

It uses a `RandomForestClassifier` (scikit-learn), trained on a
generated dataset (see `train_model.py` for exactly how and why —
there's no long-running historical dataset in a fresh school database
to train on, so a realistic synthetic dataset is used instead).

## Two versions of this service, on purpose

- **`app.py`** — a Flask app, used only for local development (`npm start` runs it on port 5001 alongside Node and React).
- **`api/predict.py`** — the same prediction logic, rewritten as a Vercel Python serverless function (no Flask needed at this layer). This is what actually gets deployed — Vercel builds any file under `api/` as its own function. It's deployed together with the frontend and Node backend as **one** Vercel project (see root `vercel.json` and the main `README.md`'s deployment section) — nothing to host separately.

Both share the same trained `model.pkl` and prediction logic, just wrapped differently for local dev vs. Vercel's serverless runtime.

## Why a separate service?

The main backend (Node/Express) handles all the school data (students,
classes, attendance, marks) and talks to MongoDB. This Python service
does **only** the ML prediction — Node calls it over HTTP with the two
numbers it needs, gets back a prediction, and sends that to the
frontend. This is a common real-world pattern called a **microservice
architecture** — different languages doing what they're best at,
talking over a REST API.

```
React (frontend)
   │
   ▼
Node.js / Express (backend, MongoDB)
   │  POST /predict  { attendancePercentage, averageMarks }
   ▼
Python / Flask (this service, scikit-learn model)
   │  { prediction, confidence, advice }
   ▼
back to Node → back to React → shown on the dashboard
```

## Setup

```
cd ml-service
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python train_model.py         # generates model.pkl (already included, but you can retrain)
python app.py                 # starts the service on http://localhost:5001
```

## API

### `POST /predict`

Request body:
```json
{ "attendancePercentage": 72, "averageMarks": 65 }
```

Response:
```json
{
  "prediction": "At Risk",
  "confidence": 81.2,
  "advice": "Performance is borderline. Improving attendance and revising weak subjects can move this into a safe zone.",
  "inputs": { "attendancePercentage": 72, "averageMarks": 65 }
}
```

### `GET /`
Health check — returns `{ "status": "ok" }`.

## Notes for the project report / viva

- **Algorithm:** Random Forest Classifier (an ensemble of decision trees) — chosen because it handles non-linear boundaries well and is easy to explain: it trains many small decision trees on random subsets of the data and votes on the final answer.
- **Features (inputs):** attendance percentage, average marks.
- **Output classes:** Pass / At Risk / Fail, with a confidence score.
- **Training data:** synthetically generated (2,000 samples) using a labelling rule based on a weighted combination of attendance and marks, plus random noise, so the model has to learn a real decision boundary rather than memorize a formula.
- **Validation accuracy:** ~87% on a held-out test split (printed when you run `train_model.py`).
