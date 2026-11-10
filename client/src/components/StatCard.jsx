import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const StatCard = ({ icon, label, value, color = "#7f5af0" }) => (
  <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
    <Box
      className="glass-card"
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${color}55, ${color}22)`,
          color,
          fontSize: 26,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </motion.div>
);

export default StatCard;
