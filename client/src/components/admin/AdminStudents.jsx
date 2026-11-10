import React from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import api from "../../services/api.js";

const AdminStudents = () => {
  const [students, setStudents] = React.useState([]);

  const load = async () => {
    const { data } = await api.get("/admin/students");
    setStudents(data.students);
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this student?")) return;
    await api.delete(`/admin/students/${id}`);
    toast.success("Student removed");
    load();
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>College</TableCell>
            <TableCell>CGPA</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.college || "-"}</TableCell>
              <TableCell>{s.cgpa || "-"}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleDelete(s._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminStudents;
