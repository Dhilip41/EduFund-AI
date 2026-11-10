import React from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Avatar,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../services/api.js";

const categories = ["General", "OBC", "SC", "ST", "EWS"];
const genders = ["Male", "Female", "Other"];

const Profile = () => {
  const [form, setForm] = React.useState(null);
  const [photoFile, setPhotoFile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setForm(data.user);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "_id" && key !== "photo") {
          formData.append(key, value);
        }
      });
      if (photoFile) formData.append("photo", photoFile);

      const { data } = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm(data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading || !form) return null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper className="glass-card" sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar src={form.photo} sx={{ width: 72, height: 72, bgcolor: "secondary.main" }}>
            {form.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {form.name}
            </Typography>
            <Button component="label" size="small" sx={{ mt: 1 }}>
              Upload Photo
              <input type="file" hidden accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
            </Button>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" name="name" value={form.name || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" name="phone" value={form.phone || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={form.category || ""}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Gender" name="gender" value={form.gender || ""} onChange={handleChange}>
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Family Annual Income (₹)"
                name="familyIncome"
                value={form.familyIncome || 0}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="State" name="state" value={form.state || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="District" name="district" value={form.district || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="College" name="college" value={form.college || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={form.department || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Education Level"
                name="educationLevel"
                value={form.educationLevel || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="CGPA"
                name="cgpa"
                inputProps={{ step: "0.01", min: 0, max: 10 }}
                value={form.cgpa || 0}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="12th Percentage"
                name="twelfthPercentage"
                value={form.twelfthPercentage || 0}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="10th Percentage"
                name="tenthPercentage"
                value={form.tenthPercentage || 0}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Parents Occupation"
                name="parentsOccupation"
                value={form.parentsOccupation || ""}
                onChange={handleChange}
              />
            </Grid>

            {[
              ["disability", "Person with Disability"],
              ["minorityStatus", "Minority Community"],
              ["hosteller", "Hosteller"],
              ["sportsQuota", "Sports Quota"],
              ["governmentEmployee", "Parent is Government Employee"],
            ].map(([field, label]) => (
              <Grid item xs={12} sm={6} md={4} key={field}>
                <FormControlLabel
                  control={<Checkbox checked={!!form[field]} onChange={handleChange} name={field} />}
                  label={label}
                />
              </Grid>
            ))}
          </Grid>

          <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
            Save Profile
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
