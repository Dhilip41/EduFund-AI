/**
 * aiService.js
 * Calls the Python Flask AI microservice (trained scikit-learn models) for
 * predictions. If the AI microservice is unreachable, falls back to a
 * deterministic rule-based scoring engine so the app remains functional
 * during development/demo without the Python service running.
 */
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const callAiService = async (path, payload) => {
  const response = await fetch(`${AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`AI service responded with ${response.status}`);
  return response.json();
};

// ---------- Rule-based fallback (used if Flask ML service is down) ----------

const fallbackScholarshipEligibility = (student, scholarship) => {
  let score = 100;
  const reasons = [];

  if (scholarship.category !== "All" && scholarship.category !== student.category) {
    score -= 40;
    reasons.push(`Category mismatch (requires ${scholarship.category})`);
  }
  if (student.familyIncome > scholarship.maxIncome) {
    score -= 30;
    reasons.push("Family income exceeds limit");
  }
  if (student.familyIncome < scholarship.minIncome) {
    score -= 10;
    reasons.push("Family income below minimum threshold");
  }
  if (student.cgpa < scholarship.minCgpa) {
    score -= 20;
    reasons.push(`CGPA below required ${scholarship.minCgpa}`);
  }
  if (student.twelfthPercentage < scholarship.minTwelfthPercentage) {
    score -= 15;
    reasons.push("12th percentage below requirement");
  }
  if (scholarship.genderEligible !== "All" && scholarship.genderEligible !== student.gender) {
    score -= 40;
    reasons.push("Gender criteria not matched");
  }
  if (scholarship.disabilityOnly && !student.disability) {
    score -= 50;
    reasons.push("Scholarship reserved for students with disability");
  }
  if (scholarship.minorityOnly && !student.minorityStatus) {
    score -= 50;
    reasons.push("Scholarship reserved for minority category");
  }
  if (
    scholarship.stateEligible !== "All" &&
    scholarship.stateEligible.toLowerCase() !== (student.state || "").toLowerCase()
  ) {
    score -= 25;
    reasons.push(`Not applicable outside ${scholarship.stateEligible}`);
  }

  score = Math.max(0, Math.min(100, score));
  return {
    eligibilityScore: score,
    reason: reasons.length ? reasons.join("; ") : "Meets all listed eligibility criteria",
  };
};

const fallbackLoanPrediction = (input) => {
  let score = 50;

  // Credit score impact
  score += (input.creditScore - 650) * 0.08;
  // Income vs loan ratio
  const totalIncome = input.income + (input.coApplicantIncome || 0);
  const ratio = totalIncome > 0 ? input.loanAmountRequired / totalIncome : 10;
  score -= Math.min(30, ratio * 2);
  // Existing loan burden
  if (input.existingLoan > 0) score -= Math.min(15, (input.existingLoan / totalIncome) * 20);
  // Repayment years (longer = slightly safer for approval, but more interest)
  score += Math.min(10, input.repaymentYears);

  score = Math.max(5, Math.min(98, Math.round(score)));

  const baseRate = input.collegeType === "Government" ? 8.5 : 9.75;
  const interestRate = input.country?.toLowerCase() === "india" ? baseRate : baseRate + 2.5;

  const monthlyRate = interestRate / 12 / 100;
  const n = input.repaymentYears * 12;
  const emi =
    (input.loanAmountRequired * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);

  return {
    approvalProbability: score,
    interestRate: Number(interestRate.toFixed(2)),
    emi: Number(emi.toFixed(2)),
    loanScore: score,
  };
};

// ---------- Public functions used by controllers ----------

const predictScholarship = async (student, scholarship) => {
  try {
    return await callAiService("/predictScholarship", { student, scholarship });
  } catch (err) {
    console.warn("AI service unreachable, using rule-based fallback:", err.message);
    return fallbackScholarshipEligibility(student, scholarship);
  }
};

const predictLoan = async (input) => {
  try {
    return await callAiService("/predictLoan", input);
  } catch (err) {
    console.warn("AI service unreachable, using rule-based fallback:", err.message);
    return fallbackLoanPrediction(input);
  }
};

module.exports = { predictScholarship, predictLoan };
