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
  name: "",
  organization: "",
  amount: "",
  category: "All",
  minIncome: 0,
  maxIncome: 1000000,
  minCgpa: 0,
  minTwelfthPercentage: 0,
  genderEligible: "All",
  stateEligible: "All",
  eligibility: "",
  deadline: "",
  description: "",
  applyLink: "",
};

const AdminScholarships = () => {
  const [list, setList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);

  const load = async () => {
    const { data } = await api.get("/scholarships");
    setList(data.scholarships);
  };

  React.useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...s, deadline: s.deadline?.slice(0, 10) });
    setOpen(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/scholarships/${editing._id}`, form);
        toast.success("Scholarship updated");
      } else {
        await api.post("/scholarships", form);
        toast.success("Scholarship created");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scholarship?")) return;
    await api.delete(`/scholarships/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <Box>
      <Button startIcon={<AddIcon />} variant="contained" sx={{ mb: 2 }} onClick={openNew}>
        Add Scholarship
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Organization</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.organization}</TableCell>
              <TableCell>₹{s.amount?.toLocaleString()}</TableCell>
              <TableCell>{s.category}</TableCell>
              <TableCell>{new Date(s.deadline).toLocaleDateString()}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => openEdit(s)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(s._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Edit Scholarship" : "New Scholarship"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Organization" name="organization" value={form.organization} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Amount" name="amount" value={form.amount} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Category" name="category" value={form.category} onChange={handleChange}>
                {["All", "General", "OBC", "SC", "ST", "EWS"].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Min Income" name="minIncome" value={form.minIncome} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Max Income" name="maxIncome" value={form.maxIncome} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Min CGPA" name="minCgpa" value={form.minCgpa} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Deadline" name="deadline" InputLabelProps={{ shrink: true }} value={form.deadline} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Eligibility" name="eligibility" value={form.eligibility} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Description" name="description" value={form.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Apply Link" name="applyLink" value={form.applyLink} onChange={handleChange} />
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

export default AdminScholarships;
