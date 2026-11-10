"""
app.py
Flask AI microservice for the Scholarship & Educational Loan
Recommendation System. Loads trained scikit-learn models (or falls
back to rule-based scoring if models haven't been trained yet) and
exposes /predictScholarship and /predictLoan endpoints consumed by
the Node/Express backend.

Run: python app.py
(Train models first with: python generate_dataset.py && python train_model.py)
"""
import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
SCHOLARSHIP_MODEL_PATH = os.path.join(MODELS_DIR, "scholarship_model.pkl")
LOAN_MODEL_PATH = os.path.join(MODELS_DIR, "loan_model.pkl")

scholarship_bundle = joblib.load(SCHOLARSHIP_MODEL_PATH) if os.path.exists(SCHOLARSHIP_MODEL_PATH) else None
loan_bundle = joblib.load(LOAN_MODEL_PATH) if os.path.exists(LOAN_MODEL_PATH) else None


def safe_encode(encoder, value):
    """Encode a categorical value; fall back to 0 for unseen labels."""
    try:
        return int(encoder.transform([str(value)])[0])
    except Exception:
        return 0


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "scholarship_model_loaded": scholarship_bundle is not None,
        "loan_model_loaded": loan_bundle is not None,
    })


@app.route("/predictScholarship", methods=["POST"])
def predict_scholarship():
    data = request.get_json(force=True)
    student = data.get("student", {})
    scholarship = data.get("scholarship", {})

    reasons = []

    if scholarship_bundle is None:
        # Fallback: simple weighted rule-based scoring
        score = 100
        if scholarship.get("category", "All") not in ("All", student.get("category")):
            score -= 40
            reasons.append("Category not matched")
        if student.get("familyIncome", 0) > scholarship.get("maxIncome", 9e9):
            score -= 30
            reasons.append("Income exceeds limit")
        if student.get("cgpa", 0) < scholarship.get("minCgpa", 0):
            score -= 20
            reasons.append("CGPA below requirement")
        score = max(0, min(100, score))
        return jsonify({
            "eligibilityScore": score,
            "reason": "; ".join(reasons) if reasons else "Meets eligibility criteria",
        })

    model = scholarship_bundle["model"]
    encoders = scholarship_bundle["encoders"]

    try:
        row = [
            student.get("familyIncome", 0),
            safe_encode(encoders["category"], student.get("category", "General")),
            safe_encode(encoders["gender"], student.get("gender", "Male")),
            safe_encode(encoders["state"], student.get("state", "Tamil Nadu")),
            student.get("cgpa", 0),
            student.get("twelfthPercentage", 0),
            student.get("tenthPercentage", 0),
            int(bool(student.get("disability", False))),
            int(bool(student.get("minorityStatus", False))),
            int(bool(student.get("hosteller", False))),
            int(bool(student.get("sportsQuota", False))),
            int(bool(student.get("governmentEmployee", False))),
        ]
        proba = model.predict_proba([row])[0]
        eligibility_score = round(float(proba[1]) * 100, 1)
    except Exception as e:
        eligibility_score = 50.0
        reasons.append(f"Model inference fallback: {str(e)}")

    # Cross-check against scholarship-specific constraints for a human-readable reason
    if scholarship.get("category", "All") not in ("All", student.get("category")):
        reasons.append("Category criteria not matched")
    if student.get("familyIncome", 0) > scholarship.get("maxIncome", 9e9):
        reasons.append("Family income exceeds scholarship limit")
    if student.get("cgpa", 0) < scholarship.get("minCgpa", 0):
        reasons.append(f"CGPA below required {scholarship.get('minCgpa', 0)}")

    return jsonify({
        "eligibilityScore": eligibility_score,
        "reason": "; ".join(reasons) if reasons else "Predicted eligible based on academic and income profile",
    })


@app.route("/predictLoan", methods=["POST"])
def predict_loan():
    data = request.get_json(force=True)

    college_fee = data.get("collegeFee", 0)
    tuition_fee = data.get("tuitionFee", 0)
    course = data.get("course", "B.Tech")
    college_type = data.get("collegeType", "Private")
    country = data.get("country", "India")
    loan_amount_required = data.get("loanAmountRequired", 0)
    repayment_years = data.get("repaymentYears", 5)
    income = data.get("income", 0)
    existing_loan = data.get("existingLoan", 0)
    credit_score = data.get("creditScore", 650)
    co_applicant_income = data.get("coApplicantIncome", 0)
    bank_interest_rate = data.get("bankInterestRate")

    if loan_bundle is None:
        total_income = income + co_applicant_income
        ratio = loan_amount_required / total_income if total_income > 0 else 10
        score = 50 + (credit_score - 650) * 0.08 - min(30, ratio * 2)
        score = max(5, min(98, round(score)))
    else:
        model = loan_bundle["model"]
        encoders = loan_bundle["encoders"]
        try:
            row = [
                college_fee,
                tuition_fee,
                safe_encode(encoders["course"], course),
                safe_encode(encoders["college_type"], college_type),
                safe_encode(encoders["country"], country),
                loan_amount_required,
                repayment_years,
                income,
                existing_loan,
                credit_score,
                co_applicant_income,
            ]
            proba = model.predict_proba([row])[0]
            score = round(float(proba[1]) * 100, 1)
        except Exception:
            score = 50.0

    base_rate = bank_interest_rate if bank_interest_rate else (8.5 if college_type == "Government" else 9.75)
    interest_rate = base_rate if country.lower() == "india" else base_rate + 2.5

    monthly_rate = interest_rate / 12 / 100
    n = max(1, repayment_years * 12)
    if monthly_rate > 0:
        emi = (loan_amount_required * monthly_rate * (1 + monthly_rate) ** n) / (
            (1 + monthly_rate) ** n - 1
        )
    else:
        emi = loan_amount_required / n

    return jsonify({
        "approvalProbability": score,
        "interestRate": round(float(interest_rate), 2),
        "emi": round(float(emi), 2),
        "loanScore": score,
    })


if __name__ == "__main__":
    port = int(os.environ.get("AI_PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
