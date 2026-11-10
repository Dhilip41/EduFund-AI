import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../redux/slices/authSlice.js";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "rgba(15,12,41,0.75)", backdropFilter: "blur(12px)" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className="gradient-text"
            sx={{ fontWeight: 800, letterSpacing: 1 }}
          >
            EduFund AI
          </Typography>
        </motion.div>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!user && (
            <>
              <Button component={Link} to="/scholarships" color="inherit">
                Scholarships
              </Button>
              <Button component={Link} to="/loans" color="inherit">
                Loans
              </Button>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" color="primary">
                Get Started
              </Button>
            </>
          )}

          {user && (
            <>
              <Button component={Link} to={user.role === "admin" ? "/admin" : "/dashboard"} color="inherit">
                Dashboard
              </Button>
              {user.role !== "admin" && (
                <>
                  <Button component={Link} to="/recommend/scholarship" color="inherit">
                    Scholarships
                  </Button>
                  <Button component={Link} to="/recommend/loan" color="inherit">
                    Loans
                  </Button>
                  <Button component={Link} to="/applications" color="inherit">
                    Applications
                  </Button>
                  <Button component={Link} to="/notifications" color="inherit">
                    Notifications
                  </Button>
                </>
              )}
              <Avatar
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ cursor: "pointer", bgcolor: "secondary.main", width: 36, height: 36 }}
                src={user.photo}
              >
                {user.name?.[0]}
              </Avatar>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
