import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import Loans from "./pages/Loans.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ScholarshipRecommendation from "./pages/ScholarshipRecommendation.jsx";
import LoanRecommendation from "./pages/LoanRecommendation.jsx";
import ApplicationHistory from "./pages/ApplicationHistory.jsx";
import Notifications from "./pages/Notifications.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/loans" element={<Loans />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/recommend/scholarship" element={<PrivateRoute><ScholarshipRecommendation /></PrivateRoute>} />
        <Route path="/recommend/loan" element={<PrivateRoute><LoanRecommendation /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><ApplicationHistory /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />

        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;
