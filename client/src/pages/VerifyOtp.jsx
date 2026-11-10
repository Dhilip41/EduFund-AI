import React from "react";
import { Container, Paper, TextField, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { verifyOtp } from "../redux/slices/authSlice.js";

const VerifyOtp = () => {
  const { state } = useLocation();
  const [otp, setOtp] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state?.userId) {
      toast.error("Missing user reference. Please register again.");
      return navigate("/register");
    }
    const result = await dispatch(verifyOtp({ userId: state.userId, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      toast.success("Account verified! You can now login.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Verification failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
          Verify Your Email
        </Typography>
        <Typography sx={{ opacity: 0.7, mb: 3, textAlign: "center" }}>
          Enter the 6-digit OTP sent to your email address.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
            Verify Account
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default VerifyOtp;
