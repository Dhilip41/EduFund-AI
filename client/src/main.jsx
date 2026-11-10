
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#0EA5E9",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172554",
      secondary: "#64748B",
    },

    divider: "#E2E8F0",
  },

  typography: {
    fontFamily: "Poppins, sans-serif",
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#172554",
          boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          theme="light"
          autoClose={3500}
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
