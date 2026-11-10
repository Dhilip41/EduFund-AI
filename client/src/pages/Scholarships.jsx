import React from "react";
import { Container, Grid, Paper, Typography, TextField, Box, Button } from "@mui/material";
import api from "../services/api.js";

const Scholarships = () => {
  const [scholarships, setScholarships] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const load = async (q = "") => {
    const { data } = await api.get(`/scholarships${q ? `?search=${q}` : ""}`);
    setScholarships(data.scholarships);
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Browse Scholarships
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search scholarships..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={() => load(search)}>
          Search
        </Button>
      </Box>
      <Grid container spacing={3}>
        {scholarships.map((s) => (
          <Grid item xs={12} md={6} key={s._id}>
            <Paper className="glass-card" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {s.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                {s.organization} · ₹{s.amount.toLocaleString()} · Category: {s.category}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {s.description}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                Deadline: {new Date(s.deadline).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Scholarships;
