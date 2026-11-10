"""
generate_dataset.py
Generates a realistic synthetic dataset (5000+ rows) for training the
scholarship eligibility and loan approval models.

Run: python generate_dataset.py
Outputs: dataset_scholarship.csv, dataset_loan.csv
"""
import numpy as np
import pandas as pd

np.random.seed(42)
N = 6000

categories = ["General", "OBC", "SC", "ST", "EWS"]
genders = ["Male", "Female", "Other"]
states = ["Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Uttar Pradesh", "Kerala", "Gujarat", "West Bengal"]
courses = ["B.Tech", "M.Tech", "MBBS", "MBA", "B.Sc", "M.Sc", "BA", "MA", "B.Com", "LLB"]
college_types = ["Government", "Private", "Deemed"]
countries = ["India", "USA", "UK", "Canada", "Australia", "Germany"]

# ---------------- Scholarship dataset ----------------
def generate_scholarship_dataset(n):
    df = pd.DataFrame({
        "family_income": np.random.randint(50000, 1500000, n),
        "category": np.random.choice(categories, n, p=[0.4, 0.3, 0.15, 0.1, 0.05]),
        "gender": np.random.choice(genders, n, p=[0.48, 0.48, 0.04]),
        "state": np.random.choice(states, n),
        "cgpa": np.round(np.random.uniform(4.5, 10.0, n), 2),
        "twelfth_percentage": np.round(np.random.uniform(45, 99, n), 2),
        "tenth_percentage": np.round(np.random.uniform(45, 99, n), 2),
        "disability": np.random.choice([0, 1], n, p=[0.92, 0.08]),
        "minority_status": np.random.choice([0, 1], n, p=[0.85, 0.15]),
        "hosteller": np.random.choice([0, 1], n, p=[0.55, 0.45]),
        "sports_quota": np.random.choice([0, 1], n, p=[0.9, 0.1]),
        "government_employee_parent": np.random.choice([0, 1], n, p=[0.75, 0.25]),
    })

    # Rule-driven label generation with noise, mirroring realistic eligibility logic
    score = (
        (df["cgpa"] / 10) * 35
        + (df["twelfth_percentage"] / 100) * 20
        + (1 - df["family_income"].clip(upper=1200000) / 1200000) * 30
        + df["disability"] * 8
        + df["minority_status"] * 5
        + df["category"].isin(["SC", "ST", "OBC", "EWS"]).astype(int) * 7
    )
    noise = np.random.normal(0, 6, n)
    score = (score + noise).clip(0, 100)

    df["eligibility_score"] = np.round(score, 1)
    df["eligible"] = (df["eligibility_score"] >= 50).astype(int)
    return df


# ---------------- Loan dataset ----------------
def generate_loan_dataset(n):
    df = pd.DataFrame({
        "college_fee": np.random.randint(100000, 4000000, n),
        "tuition_fee": np.random.randint(50000, 2500000, n),
        "course": np.random.choice(courses, n),
        "college_type": np.random.choice(college_types, n, p=[0.35, 0.5, 0.15]),
        "country": np.random.choice(countries, n, p=[0.6, 0.12, 0.1, 0.08, 0.06, 0.04]),
        "loan_amount_required": np.random.randint(100000, 5000000, n),
        "repayment_years": np.random.randint(3, 15, n),
        "income": np.random.randint(100000, 3000000, n),
        "existing_loan": np.random.choice(
            [0, 50000, 100000, 200000, 500000], n, p=[0.6, 0.15, 0.12, 0.08, 0.05]
        ),
        "credit_score": np.random.randint(550, 900, n),
        "co_applicant_income": np.random.randint(0, 2000000, n),
    })

    total_income = df["income"] + df["co_applicant_income"]
    debt_ratio = df["loan_amount_required"] / total_income.clip(lower=1)

    score = (
        (df["credit_score"] - 550) / 350 * 45
        + (1 - debt_ratio.clip(upper=3) / 3) * 30
        + (1 - df["existing_loan"].clip(upper=500000) / 500000) * 15
        + (df["repayment_years"] / 15) * 10
    )
    noise = np.random.normal(0, 5, n)
    score = (score + noise).clip(0, 100)

    df["approval_probability"] = np.round(score, 1)
    df["approved"] = (df["approval_probability"] >= 50).astype(int)

    base_rate = np.where(df["college_type"] == "Government", 8.5, 9.75)
    intl_premium = np.where(df["country"] != "India", 2.5, 0)
    df["interest_rate"] = np.round(base_rate + intl_premium + np.random.normal(0, 0.3, n), 2)

    return df


if __name__ == "__main__":
    scholarship_df = generate_scholarship_dataset(N)
    loan_df = generate_loan_dataset(N)

    scholarship_df.to_csv("dataset_scholarship.csv", index=False)
    loan_df.to_csv("dataset_loan.csv", index=False)

    print(f"Generated dataset_scholarship.csv with {len(scholarship_df)} rows")
    print(f"Generated dataset_loan.csv with {len(loan_df)} rows")
