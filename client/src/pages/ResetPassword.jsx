import React from "react";
import { Container, Paper, TextField, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          Set New Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
