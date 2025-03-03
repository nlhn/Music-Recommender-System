import "./App.css";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import Login from "./User/Login";
import Register from "./User/Register";
import Dashboard from "./User/Dashboard";
import Groups from "./Group/Groups";
import Group from "./Group/Group";
import Campaigns from "./Campaign/Campaigns";
import Campaign from "./Campaign/Campaign";

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("token") && localStorage.getItem("userId");
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const getPalette = () => {
    let palettes = {
      light: {
        mode: "light",
        background: {
          default: "#eeeeee",
          paper: "#f5f5f5",
        },
      },
      dark: {
        mode: "dark",
        background: {
          default: "#303030",
          paper: "#424242",
        },
      },
    };

    const theme = sessionStorage.getItem("theme");
    if (theme && ["light", "dark"].includes(theme)) {
      return palettes[theme];
    }

    return palettes.light;
  };

  return (
    <div className="App">
      <ThemeProvider
        theme={createTheme({
          palette: getPalette(),
        })}
      >
        <CssBaseline />
        <Box sx={{ m: 4 }}>
          <Routes>
            <Route key={1} path="/login" element={<Login />} />
            <Route key={2} path="/register" element={<Register />} />
            <Route
              key={3}
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              key={4}
              path="/groups"
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              }
            />
            <Route
              key={5}
              path="/groups/:groupId"
              element={
                <ProtectedRoute>
                  <Group />
                </ProtectedRoute>
              }
            />
            <Route
              key={6}
              path="/groups/:groupId/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route
              key={7}
              path="/groups/:groupId/campaigns/:campaignId"
              element={
                <ProtectedRoute>
                  <Campaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated() ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
