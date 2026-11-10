/**
 * Run with: npm run seed
 * Populates the database with a sample admin account, scholarships, and banks.
 */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Scholarship = require("../models/Scholarship");
const Bank = require("../models/Bank");

const seed = async () => {
  await connectDB();

  await User.deleteMany({ role: "admin" });
  await Scholarship.deleteMany({});
  await Bank.deleteMany({});

  await User.create({
    name: "System Admin",
    email: "admin@scholarloan.com",
    password: "Admin@123",
    role: "admin",
    isVerified: true,
  });

  await Scholarship.insertMany([
    {
      name: "National Merit Scholarship",
      organization: "Ministry of Education",
      amount: 50000,
      category: "All",
      minIncome: 0,
      maxIncome: 800000,
      minCgpa: 7.5,
      minTwelfthPercentage: 85,
      genderEligible: "All",
      stateEligible: "All",
      eligibility: "Open to all students with CGPA above 7.5 and family income below 8 lakhs",
      documentsRequired: ["Income Certificate", "Mark Sheets", "Aadhar Card"],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      description: "A merit-based scholarship for high-performing students across all categories.",
      applyLink: "https://scholarships.gov.in",
    },
    {
      name: "SC/ST Welfare Scholarship",
      organization: "State Social Welfare Department",
      amount: 30000,
      category: "SC",
      minIncome: 0,
      maxIncome: 250000,
      minCgpa: 6,
      minTwelfthPercentage: 60,
      genderEligible: "All",
      stateEligible: "All",
      eligibility: "For SC category students with family income below 2.5 lakhs",
      documentsRequired: ["Caste Certificate", "Income Certificate", "Bank Passbook"],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: "Welfare scholarship supporting SC category students pursuing higher education.",
      applyLink: "https://scholarships.gov.in",
    },
    {
      name: "Girl Child Education Scholarship",
      organization: "Women & Child Development Ministry",
      amount: 25000,
      category: "All",
      genderEligible: "Female",
      minIncome: 0,
      maxIncome: 400000,
      minCgpa: 6.5,
      minTwelfthPercentage: 65,
      stateEligible: "All",
      eligibility: "For female students with family income below 4 lakhs",
      documentsRequired: ["Income Certificate", "Mark Sheets"],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      description: "Encourages higher education among female students from low-income families.",
      applyLink: "https://scholarships.gov.in",
    },
    {
      name: "Minority Community Scholarship",
      organization: "Minority Affairs Department",
      amount: 20000,
      category: "All",
      minorityOnly: true,
      minIncome: 0,
      maxIncome: 300000,
      minCgpa: 6,
      minTwelfthPercentage: 55,
      stateEligible: "All",
      eligibility: "Reserved for students belonging to notified minority communities",
      documentsRequired: ["Minority Certificate", "Income Certificate"],
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      description: "Supports higher education for students from minority communities.",
      applyLink: "https://scholarships.gov.in",
    },
    {
      name: "Differently Abled Student Grant",
      organization: "Department of Empowerment of Persons with Disabilities",
      amount: 35000,
      category: "All",
      disabilityOnly: true,
      minIncome: 0,
      maxIncome: 600000,
      minCgpa: 5.5,
      minTwelfthPercentage: 50,
      stateEligible: "All",
      eligibility: "For students with a certified disability of 40% or above",
      documentsRequired: ["Disability Certificate", "Income Certificate"],
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      description: "Grant to support differently-abled students pursuing higher education.",
      applyLink: "https://scholarships.gov.in",
    },
  ]);

  await Bank.insertMany([
    {
      bankName: "State Bank of India - Education Loan",
      loanType: "Both",
      interestRate: 8.65,
      processingFee: 5000,
      maxAmount: 4000000,
      minCreditScore: 650,
      eligibility: "Indian resident, admission confirmed in recognized institution",
      documentsRequired: ["Admission Letter", "Fee Structure", "Income Proof", "Co-applicant KYC"],
    },
    {
      bankName: "HDFC Credila",
      loanType: "International",
      interestRate: 10.5,
      processingFee: 15000,
      maxAmount: 8000000,
      minCreditScore: 700,
      eligibility: "Admission confirmed abroad, co-applicant with stable income",
      documentsRequired: ["Admission Letter", "Visa", "Co-applicant Income Proof"],
    },
    {
      bankName: "Bank of Baroda - Baroda Gyan",
      loanType: "Domestic",
      interestRate: 9.15,
      processingFee: 2000,
      maxAmount: 2000000,
      minCreditScore: 620,
      eligibility: "Admission in India-based recognized institutions",
      documentsRequired: ["Admission Letter", "Fee Structure", "Income Proof"],
    },
    {
      bankName: "Axis Bank Education Loan",
      loanType: "Both",
      interestRate: 11.25,
      processingFee: 10000,
      maxAmount: 7500000,
      minCreditScore: 680,
      eligibility: "Good academic record, co-applicant required for amounts above 4 lakhs",
      documentsRequired: ["Admission Letter", "Academic Records", "Co-applicant KYC"],
    },
    {
      bankName: "Canara Bank Vidya Turant",
      loanType: "Domestic",
      interestRate: 8.9,
      processingFee: 3000,
      maxAmount: 1000000,
      minCreditScore: 600,
      eligibility: "Instant sanction for premier institution admits",
      documentsRequired: ["Admission Letter", "Fee Structure"],
    },
  ]);

  console.log("Seed data inserted successfully.");
  console.log("Admin login -> email: admin@scholarloan.com  password: Admin@123");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
