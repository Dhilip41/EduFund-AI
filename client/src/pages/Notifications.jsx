import React from "react";
import { Container, Typography, Paper, Box, Chip } from "@mui/material";
import api from "../services/api.js";

const typeColor = { Approved: "success", Rejected: "error", Deadline: "warning", Reminder: "info", General: "default" };

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
    };
    load();
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Notifications
      </Typography>
      {notifications.length === 0 && <Typography sx={{ opacity: 0.6 }}>No notifications yet.</Typography>}
      {notifications.map((n) => (
        <Paper
          key={n._id}
          className="glass-card"
          sx={{ p: 3, mb: 2, opacity: n.isRead ? 0.6 : 1, cursor: "pointer" }}
          onClick={() => !n.isRead && markRead(n._id)}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontWeight: 700 }}>{n.title}</Typography>
            <Chip size="small" label={n.type} color={typeColor[n.type]} />
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            {n.message}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            {new Date(n.createdAt).toLocaleString()}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default Notifications;
