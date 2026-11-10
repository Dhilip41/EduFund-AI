"""
train_model.py
Trains scholarship eligibility and loan approval models, compares
RandomForest / DecisionTree / GradientBoosting, and saves the best
performing model as model.pkl for each task.

Run: python train_model.py
(Run generate_dataset.py first to create the CSVs.)
"""
import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)


def encode_columns(df, columns, encoders=None):
    encoders = encoders or {}
    for col in columns:
        if col not in encoders:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            encoders[col] = le
        else:
            df[col] = encoders[col].transform(df[col].astype(str))
    return df, encoders


def train_and_compare(X_train, X_test, y_train, y_test):
    candidates = {
        "RandomForest": RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=8, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=150, max_depth=3, random_state=42),
    }

    best_name, best_model, best_acc = None, None, -1
    for name, model in candidates.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"  {name}: accuracy = {acc:.4f}")
        if acc > best_acc:
            best_name, best_model, best_acc = name, model, acc

    print(f"  -> Best model: {best_name} ({best_acc:.4f} accuracy)")
    return best_model, best_name, best_acc


def train_scholarship_model():
    print("Training scholarship eligibility model...")
    df = pd.read_csv("dataset_scholarship.csv")

    cat_cols = ["category", "gender", "state"]
    df, encoders = encode_columns(df, cat_cols)

    feature_cols = [
        "family_income", "category", "gender", "state", "cgpa",
        "twelfth_percentage", "tenth_percentage", "disability",
        "minority_status", "hosteller", "sports_quota", "government_employee_parent",
    ]
    X = df[feature_cols]
    y = df["eligible"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model, name, acc = train_and_compare(X_train, X_test, y_train, y_test)

    joblib.dump(
        {"model": model, "encoders": encoders, "feature_cols": feature_cols, "algorithm": name, "accuracy": acc},
        os.path.join(MODELS_DIR, "scholarship_model.pkl"),
    )
    print("Saved models/scholarship_model.pkl\n")


def train_loan_model():
    print("Training loan approval model...")
    df = pd.read_csv("dataset_loan.csv")

    cat_cols = ["course", "college_type", "country"]
    df, encoders = encode_columns(df, cat_cols)

    feature_cols = [
        "college_fee", "tuition_fee", "course", "college_type", "country",
        "loan_amount_required", "repayment_years", "income", "existing_loan",
        "credit_score", "co_applicant_income",
    ]
    X = df[feature_cols]
    y = df["approved"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model, name, acc = train_and_compare(X_train, X_test, y_train, y_test)

    joblib.dump(
        {"model": model, "encoders": encoders, "feature_cols": feature_cols, "algorithm": name, "accuracy": acc},
        os.path.join(MODELS_DIR, "loan_model.pkl"),
    )
    print("Saved models/loan_model.pkl\n")


if __name__ == "__main__":
    if not os.path.exists("dataset_scholarship.csv") or not os.path.exists("dataset_loan.csv"):
        print("Dataset files not found. Run 'python generate_dataset.py' first.")
        exit(1)

    train_scholarship_model()
    train_loan_model()
    print("Training complete. Models saved in ai/models/")
