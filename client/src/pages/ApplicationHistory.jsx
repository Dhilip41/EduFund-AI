import React from "react";
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tabs, Tab } from "@mui/material";
import api from "../services/api.js";

const statusColor = { Approved: "success", Rejected: "error", Pending: "warning" };

const ApplicationHistory = () => {
  const [tab, setTab] = React.useState(0);
  const [scholarshipApps, setScholarshipApps] = React.useState([]);
  const [loanApps, setLoanApps] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      const [sRes, lRes] = await Promise.all([
        api.get("/scholarships/applications/me"),
        api.get("/loans/applications/me"),
      ]);
      setScholarshipApps(sRes.data.applications);
      setLoanApps(lRes.data.applications);
    };
    load();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Application History
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Scholarships" />
        <Tab label="Loans" />
      </Tabs>

      <Paper className="glass-card" sx={{ p: 2 }}>
        {tab === 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scholarship</TableCell>
                <TableCell>Eligibility Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scholarshipApps.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.scholarship?.name}</TableCell>
                  <TableCell>{a.eligibilityScore}%</TableCell>
                  <TableCell>
                    <Chip size="small" label={a.status} color={statusColor[a.status]} />
                  </TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {tab === 1 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bank</TableCell>
                <TableCell>Loan Amount</TableCell>
                <TableCell>Approval %</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanApps.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.bank?.bankName}</TableCell>
                  <TableCell>₹{a.loanAmountRequired?.toLocaleString()}</TableCell>
                  <TableCell>{a.approvalProbability}%</TableCell>
                  <TableCell>
                    <Chip size="small" label={a.status} color={statusColor[a.status]} />
                  </TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default ApplicationHistory;
