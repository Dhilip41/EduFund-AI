import React from "react";
import { Container, Grid, Typography, Box, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import StatCard from "../components/StatCard.jsx";
import api from "../services/api.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [scholarshipApps, setScholarshipApps] = React.useState([]);
  const [loanApps, setLoanApps] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [sRes, lRes, nRes] = await Promise.all([
          api.get("/scholarships/applications/me"),
          api.get("/loans/applications/me"),
          api.get("/notifications"),
        ]);
        setScholarshipApps(sRes.data.applications || []);
        setLoanApps(lRes.data.applications || []);
        setNotifications(nRes.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const approvedCount =
    scholarshipApps.filter((a) => a.status === "Approved").length +
    loanApps.filter((a) => a.status === "Approved").length;
  const pendingCount =
    scholarshipApps.filter((a) => a.status === "Pending").length +
    loanApps.filter((a) => a.status === "Pending").length;
  const rejectedCount =
    scholarshipApps.filter((a) => a.status === "Rejected").length +
    loanApps.filter((a) => a.status === "Rejected").length;

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approvedCount, pendingCount, rejectedCount],
        backgroundColor: ["#2cb67d", "#f5a623", "#e5484d"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Welcome, {user?.name?.split(" ")[0]} 👋
      </Typography>
      <Typography sx={{ opacity: 0.7, mb: 4 }}>
        Here's an overview of your scholarship and loan applications.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<SchoolIcon />} label="Scholarship Applications" value={scholarshipApps.length} color="#7f5af0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<AccountBalanceIcon />} label="Loan Applications" value={loanApps.length} color="#2cb67d" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<TrendingUpIcon />} label="Approved" value={approvedCount} color="#2cb67d" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<NotificationsIcon />} label="Notifications" value={notifications.filter((n) => !n.isRead).length} color="#f5a623" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Application Status
            </Typography>
            {approvedCount + pendingCount + rejectedCount > 0 ? (
              <Doughnut data={chartData} />
            ) : (
              <Typography sx={{ opacity: 0.6 }}>No applications yet.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper className="glass-card" sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Notifications
            </Typography>
            {notifications.length === 0 && <Typography sx={{ opacity: 0.6 }}>No notifications yet.</Typography>}
            {notifications.slice(0, 6).map((n) => (
              <Box
                key={n._id}
                sx={{
                  py: 1.5,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{n.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {n.message}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
