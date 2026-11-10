import React from "react";
import { Box, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../services/api.js";

const statusColor = { Approved: "success", Rejected: "error", Pending: "warning" };

const AdminApplications = ({ onStatusChange }) => {
  const [tab, setTab] = React.useState(0);
  const [scholarshipApps, setScholarshipApps] = React.useState([]);
  const [loanApps, setLoanApps] = React.useState([]);

  const load = async () => {
    const [sRes, lRes] = await Promise.all([
      api.get("/admin/scholarship-applications"),
      api.get("/admin/loan-applications"),
    ]);
    setScholarshipApps(sRes.data.applications);
    setLoanApps(lRes.data.applications);
  };

  React.useEffect(() => {
    load();
  }, []);

  const updateScholarship = async (id, status) => {
    try {
      await api.put(`/admin/scholarship-applications/${id}`, { status });
      toast.success(`Application ${status.toLowerCase()}`);
      load();
      onStatusChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const updateLoan = async (id, status) => {
    try {
      await api.put(`/admin/loan-applications/${id}`, { status });
      toast.success(`Application ${status.toLowerCase()}`);
      load();
      onStatusChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Scholarship Applications" />
        <Tab label="Loan Applications" />
      </Tabs>

      {tab === 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Scholarship</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scholarshipApps.map((a) => (
              <TableRow key={a._id}>
                <TableCell>{a.student?.name}</TableCell>
                <TableCell>{a.scholarship?.name}</TableCell>
                <TableCell>{a.eligibilityScore}%</TableCell>
                <TableCell>
                  <Chip size="small" label={a.status} color={statusColor[a.status]} />
                </TableCell>
                <TableCell align="right">
                  {a.status === "Pending" && (
                    <>
                      <Button size="small" color="success" onClick={() => updateScholarship(a._id, "Approved")}>
                        Approve
                      </Button>
                      <Button size="small" color="error" onClick={() => updateScholarship(a._id, "Rejected")}>
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {tab === 1 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Approval %</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanApps.map((a) => (
              <TableRow key={a._id}>
                <TableCell>{a.student?.name}</TableCell>
                <TableCell>{a.bank?.bankName}</TableCell>
                <TableCell>{a.approvalProbability}%</TableCell>
                <TableCell>
                  <Chip size="small" label={a.status} color={statusColor[a.status]} />
                </TableCell>
                <TableCell align="right">
                  {a.status === "Pending" && (
                    <>
                      <Button size="small" color="success" onClick={() => updateLoan(a._id, "Approved")}>
                        Approve
                      </Button>
                      <Button size="small" color="error" onClick={() => updateLoan(a._id, "Rejected")}>
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default AdminApplications;
