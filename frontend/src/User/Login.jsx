import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const result = await loginUser(credentials).unwrap();
      console.log(result);
      // TODO: set token in cookie
      localStorage.setItem("token", "123");
      localStorage.setItem("userId", result.data.id);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.data?.message || "Failed to login. Please check your credentials."
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login to Music Recommender
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Register here</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
