import React from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api.js";
import { useSelector } from "react-redux";

const ScholarshipRecommendation = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState(null);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/prediction/predictScholarship", {});
      setRecommendations(data.recommendations);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const applyToScholarship = async (id) => {
    try {
      await api.post(`/scholarships/${id}/apply`);
      toast.success("Application submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  React.useEffect(() => {
    if (token) getRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            AI Scholarship Recommendations
          </Typography>
          <Typography sx={{ opacity: 0.7 }}>
            Based on your profile, here are the scholarships you're most eligible for.
          </Typography>
        </Box>
        <Button variant="contained" onClick={getRecommendations} disabled={loading}>
          {loading ? "Analyzing..." : "Refresh Recommendations"}
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3}>
        {recommendations?.length === 0 && (
          <Grid item xs={12}>
            <Paper className="glass-card" sx={{ p: 4, textAlign: "center" }}>
              <Typography>No strong matches found. Complete your profile for better results.</Typography>
            </Paper>
          </Grid>
        )}
        {recommendations?.map((r) => (
          <Grid item xs={12} md={6} key={r.scholarship._id}>
            <Paper className="glass-card" sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {r.scholarship.name}
                </Typography>
                <Chip
                  label={`${r.eligibilityScore}% match`}
                  color={r.eligibilityScore >= 70 ? "success" : "warning"}
                />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                {r.scholarship.organization} · ₹{r.scholarship.amount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {r.scholarship.description}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6, display: "block", mb: 1 }}>
                Reason: {r.reason}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6, display: "block", mb: 2 }}>
                Deadline: {new Date(r.scholarship.deadline).toLocaleDateString()}
              </Typography>
              <Button variant="contained" size="small" onClick={() => applyToScholarship(r.scholarship._id)}>
                Apply Now
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ScholarshipRecommendation;
