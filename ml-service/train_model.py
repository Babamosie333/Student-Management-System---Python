"""
train_model.py

Trains a small scikit-learn classifier that predicts a student's likely
result band (Pass / At Risk / Fail) from:
  - attendance percentage
  - average marks obtained so far

There's no real historical dataset from the school system to train on
(it's a fresh MongoDB with no long-term records), so we generate a
synthetic-but-realistic training set based on a simple, explainable rule
of thumb: attendance and marks both being low strongly correlates with
failing, both being high strongly correlates with passing, and mixed
cases land in "At Risk". Random noise is added so the model actually has
to learn a decision boundary instead of memorizing a rule.

Run this once (`python train_model.py`) to (re)generate model.pkl.
The Flask app (app.py) loads model.pkl at startup.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

def label_for(attendance, marks):
    """Ground-truth labelling rule used to generate training data."""
    score = 0.5 * attendance + 0.5 * marks
    if score >= 70:
        return 2  # Pass
    elif score >= 45:
        return 1  # At Risk
    else:
        return 0  # Fail

def generate_dataset(n_samples=2000):
    attendance = np.random.uniform(0, 100, n_samples)
    marks = np.random.uniform(0, 100, n_samples)

    # add noise so the boundary isn't perfectly linear / trivially memorized
    noisy_attendance = np.clip(attendance + np.random.normal(0, 5, n_samples), 0, 100)
    noisy_marks = np.clip(marks + np.random.normal(0, 5, n_samples), 0, 100)

    X = np.column_stack([attendance, marks])
    y = np.array([label_for(a, m) for a, m in zip(noisy_attendance, noisy_marks)])
    return X, y

def main():
    X, y = generate_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,
        random_state=RANDOM_STATE
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Validation accuracy: {acc * 100:.2f}%")

    joblib.dump(model, "model.pkl")
    print("Saved model.pkl")

if __name__ == "__main__":
    main()
