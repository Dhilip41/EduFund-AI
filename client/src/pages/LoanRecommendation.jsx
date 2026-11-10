import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api.js";

const collegeTypes = ["Government", "Private", "Deemed"];
const countries = ["India", "USA", "UK", "Canada", "Australia", "Germany"];

const initialForm = {
  collegeFee: "",
  tuitionFee: "",
  course: "",
  collegeType: "Private",
  country: "India",
  loanAmountRequired: "",
  repaymentYears: 5,
  income: "",
  existingLoan: 0,
  creditScore: 700,
  coApplicantIncome: 0,
};

const LoanRecommendation = () => {
  const [form, setForm] = React.useState(initialForm);
  const [loading, setLoading] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [
          k,
          ["course", "collegeType", "country"].includes(k) ? v : Number(v),
        ])
      );
      const { data } = await api.post("/prediction/predictLoan", payload);
      setRecommendations(data.recommendations);
    } catch (err) {
      toast.error(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const applyLoan = async (bankId) => {
    try {
      const payload = {
        bankId,
        ...Object.fromEntries(
          Object.entries(form).map(([k, v]) => [
            k,
            ["course", "collegeType", "country"].includes(k) ? v : Number(v),
          ])
        ),
      };
      await api.post("/loans/apply", payload);
      toast.success("Loan application submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        AI Educational Loan Recommendation
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 4 }}>
        Enter your loan requirements to get bank-wise approval probability and EMI estimates.
      </Typography>

      <Paper className="glass-card" sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="College Fee (₹)" name="collegeFee" value={form.collegeFee} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Tuition Fee (₹)" name="tuitionFee" value={form.tuitionFee} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Course" name="course" value={form.course} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="College Type" name="collegeType" value={form.collegeType} onChange={handleChange}>
                {collegeTypes.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Country" name="country" value={form.country} onChange={handleChange}>
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Loan Amount Required (₹)" name="loanAmountRequired" value={form.loanAmountRequired} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Repayment Years" name="repaymentYears" value={form.repaymentYears} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Annual Income (₹)" name="income" value={form.income} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Existing Loan (₹)" name="existingLoan" value={form.existingLoan} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Credit Score" name="creditScore" value={form.creditScore} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type="number" label="Co-Applicant Income (₹)" name="coApplicantIncome" value={form.coApplicantIncome} onChange={handleChange} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            {loading ? "Predicting..." : "Get AI Recommendations"}
          </Button>
        </form>
      </Paper>

      <Grid container spacing={3}>
        {recommendations?.map((r) => (
          <Grid item xs={12} md={6} key={r.bank._id}>
            <Paper className="glass-card" sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {r.bank.bankName}
                </Typography>
                <Chip
                  label={`${r.approvalProbability}% approval`}
                  color={r.approvalProbability >= 60 ? "success" : "warning"}
                />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.75, my: 1 }}>
                Interest Rate: {r.interestRate}% · Estimated EMI: ₹{r.emi.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6, display: "block", mb: 2 }}>
                Loan Score: {r.loanScore}/100
              </Typography>
              <Button variant="contained" size="small" onClick={() => applyLoan(r.bank._id)}>
                Apply Now
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LoanRecommendation;
