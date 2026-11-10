import React from "react";
import { Container, Paper, TextField, Button, Typography, Link as MLink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../redux/slices/authSlice.js";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(login(values));
      if (login.fulfilled.match(result)) {
        toast.success("Welcome back!");
        navigate(result.payload.user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        toast.error(result.payload || "Login failed");
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          Welcome Back
        </Typography>
        <form onSubmit={formik.handleSubmit}>
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
          <Typography sx={{ textAlign: "right", mt: 1 }}>
            <MLink component={Link} to="/forgot-password" sx={{ fontSize: 14 }}>
              Forgot password?
            </MLink>
          </Typography>
          <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Typography sx={{ mt: 3, textAlign: "center", opacity: 0.8 }}>
          Don't have an account?{" "}
          <MLink component={Link} to="/register">
            Register
          </MLink>
        </Typography>
        <Typography sx={{ mt: 1, textAlign: "center", opacity: 0.5, fontSize: 12 }}>
          Admin demo login: admin@scholarloan.com / Admin@123
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
