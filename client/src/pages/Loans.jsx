import React from "react";
import { Container, Grid, Paper, Typography, TextField, Box, Button } from "@mui/material";
import api from "../services/api.js";

const Loans = () => {
  const [banks, setBanks] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const load = async (q = "") => {
    const { data } = await api.get(`/loans/banks${q ? `?search=${q}` : ""}`);
    setBanks(data.banks);
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Browse Education Loan Banks
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField fullWidth placeholder="Search banks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => load(search)}>
          Search
        </Button>
      </Box>
      <Grid container spacing={3}>
        {banks.map((b) => (
          <Grid item xs={12} md={6} key={b._id}>
            <Paper className="glass-card" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {b.bankName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                Interest: {b.interestRate}% · Max Amount: ₹{b.maxAmount.toLocaleString()} · Type: {b.loanType}
              </Typography>
              <Typography variant="body2">{b.eligibility}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Loans;
