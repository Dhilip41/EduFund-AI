import React from "react";
import { Container, Paper, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api.js";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If the email exists, a reset link has been sent.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          Reset Your Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
