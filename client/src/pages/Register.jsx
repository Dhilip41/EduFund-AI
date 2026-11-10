import React from "react";
import { Box, Container, Paper, TextField, Button, Typography, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register } from "../redux/slices/authSlice.js";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(register(values));
      if (register.fulfilled.match(result)) {
        toast.success("Registered! Check your email for the OTP.");
        navigate("/verify-otp", { state: { userId: result.payload.userId } });
      } else {
        toast.error(result.payload || "Registration failed");
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          Create Your Account
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <Typography sx={{ mt: 3, textAlign: "center", opacity: 0.8 }}>
          Already have an account?{" "}
          <MLink component={Link} to="/login">
            Login
          </MLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
