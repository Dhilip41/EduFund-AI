import React from "react";
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import api from "../../services/api.js";

const emptyForm = {
  bankName: "",
  loanType: "Both",
  interestRate: "",
  processingFee: "",
  maxAmount: "",
  minCreditScore: 650,
  eligibility: "",
};

const AdminBanks = () => {
  const [list, setList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);

  const load = async () => {
    const { data } = await api.get("/loans/banks");
    setList(data.banks);
  };

  React.useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm(b);
    setOpen(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/loans/banks/${editing._id}`, form);
        toast.success("Bank updated");
      } else {
        await api.post("/loans/banks", form);
        toast.success("Bank created");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bank?")) return;
    await api.delete(`/loans/banks/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <Box>
      <Button startIcon={<AddIcon />} variant="contained" sx={{ mb: 2 }} onClick={openNew}>
        Add Bank
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bank</TableCell>
            <TableCell>Interest Rate</TableCell>
            <TableCell>Max Amount</TableCell>
            <TableCell>Loan Type</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((b) => (
            <TableRow key={b._id}>
              <TableCell>{b.bankName}</TableCell>
              <TableCell>{b.interestRate}%</TableCell>
              <TableCell>₹{b.maxAmount?.toLocaleString()}</TableCell>
              <TableCell>{b.loanType}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => openEdit(b)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(b._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Edit Bank" : "New Bank"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Loan Type" name="loanType" value={form.loanType} onChange={handleChange}>
                {["Domestic", "International", "Both"].map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Interest Rate (%)" name="interestRate" value={form.interestRate} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Processing Fee (₹)" name="processingFee" value={form.processingFee} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Max Amount (₹)" name="maxAmount" value={form.maxAmount} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Min Credit Score" name="minCreditScore" value={form.minCreditScore} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Eligibility" name="eligibility" value={form.eligibility} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBanks;
