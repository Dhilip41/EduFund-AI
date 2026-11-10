import React from "react";
import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PsychologyIcon from "@mui/icons-material/Psychology";

const features = [
  {
    icon: <SchoolIcon fontSize="large" />,
    title: "Scholarship Matching",
    desc: "AI-driven eligibility scoring across income, category, academics and more.",
  },
  {
    icon: <AccountBalanceIcon fontSize="large" />,
    title: "Loan Recommendation",
    desc: "Compare banks by approval probability, interest rate and EMI instantly.",
  },
  {
    icon: <PsychologyIcon fontSize="large" />,
    title: "ML-Powered Predictions",
    desc: "Trained Random Forest / Gradient Boosting models predict your best-fit options.",
  },
];

const Landing = () => (
  <Box>
    <Container sx={{ py: 10, textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          Find Your Best <span className="gradient-text">Scholarship</span> & <span className="gradient-text">Loan</span>
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.75, maxWidth: 700, mx: "auto", mb: 4 }}>
          An AI-based recommendation engine that matches students with the scholarships they
          qualify for and the education loans they're most likely to be approved for.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button component={Link} to="/register" variant="contained" size="large">
            Get Started Free
          </Button>
          <Button component={Link} to="/scholarships" variant="outlined" size="large">
            Browse Scholarships
          </Button>
        </Box>
      </motion.div>
    </Container>

    <Container sx={{ pb: 10 }}>
      <Grid container spacing={4}>
        {features.map((f, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Paper className="glass-card" sx={{ p: 4, height: "100%" }}>
                <Box sx={{ color: "primary.main", mb: 2 }}>{f.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ opacity: 0.75 }}>{f.desc}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Landing;
