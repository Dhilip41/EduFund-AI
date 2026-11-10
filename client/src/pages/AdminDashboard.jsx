import React from "react";
import { Container, Grid, Typography, Paper, Tabs, Tab, Box } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import StatCard from "../components/StatCard.jsx";
import api from "../services/api.js";
import AdminScholarships from "../components/admin/AdminScholarships.jsx";
import AdminBanks from "../components/admin/AdminBanks.jsx";
import AdminApplications from "../components/admin/AdminApplications.jsx";
import AdminStudents from "../components/admin/AdminStudents.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const monthLabel = (m) => {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[m - 1];
};

const AdminDashboard = () => {
  const [tab, setTab] = React.useState(0);
  const [analytics, setAnalytics] = React.useState(null);

  const loadAnalytics = async () => {
    const { data } = await api.get("/admin/analytics");
    setAnalytics(data.analytics);
  };

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  const monthlyLabels = analytics?.monthlyScholarship?.map((m) => `${monthLabel(m._id.month)} ${m._id.year}`) || [];

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Scholarship Applications",
        data: analytics?.monthlyScholarship?.map((m) => m.count) || [],
        backgroundColor: "#7f5af0",
      },
      {
        label: "Loan Applications",
        data: analytics?.monthlyLoan?.map((m) => m.count) || [],
        backgroundColor: "#2cb67d",
      },
    ],
  };

  const pieData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        data: analytics
          ? [
              analytics.scholarshipApproved + analytics.loanApproved,
              analytics.scholarshipRejected + analytics.loanRejected,
              analytics.totalScholarshipApps +
                analytics.totalLoanApps -
                (analytics.scholarshipApproved + analytics.loanApproved) -
                (analytics.scholarshipRejected + analytics.loanRejected),
            ]
          : [],
        backgroundColor: ["#2cb67d", "#e5484d", "#f5a623"],
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Admin Dashboard
      </Typography>

      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<PeopleIcon />} label="Total Students" value={analytics.totalStudents} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<SchoolIcon />} label="Scholarships" value={analytics.totalScholarships} color="#2cb67d" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<AccountBalanceIcon />} label="Partner Banks" value={analytics.totalBanks} color="#f5a623" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<DescriptionIcon />} label="Approval Rate" value={`${analytics.approvalRate}%`} color="#e5484d" />
          </Grid>
        </Grid>
      )}

      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper className="glass-card" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Monthly Applications
              </Typography>
              <Bar data={barData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper className="glass-card" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Approval Breakdown
              </Typography>
              <Pie data={pieData} />
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper className="glass-card" sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable">
          <Tab label="Scholarships" />
          <Tab label="Banks" />
          <Tab label="Applications" />
          <Tab label="Students" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tab === 0 && <AdminScholarships />}
          {tab === 1 && <AdminBanks />}
          {tab === 2 && <AdminApplications onStatusChange={loadAnalytics} />}
          {tab === 3 && <AdminStudents />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
