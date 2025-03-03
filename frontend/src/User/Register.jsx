import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    instrument: "",
    proficiency: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("userId")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Instrument choices from backend
  const instruments = [
    { id: 0, name: "Guitar" },
    { id: 1, name: "Bass" },
    { id: 2, name: "Drums" },
    { id: 3, name: "Piano" },
  ];

  // Proficiency levels from backend
  const proficiencyLevels = [
    { id: 0, name: "Beginner" },
    { id: 1, name: "Intermediate" },
    { id: 2, name: "Advanced" },
  ];

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!userData.email || !userData.password || !userData.confirmPassword) {
      setError("Please fill all required fields");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userData.instrument) {
      setError("Please select an instrument");
      return;
    }

    if (!userData.proficiency) {
      setError("Please select your proficiency level");
      return;
    }

    try {
      const { confirmPassword, ...dataToSubmit } = userData;

      const result = await createUser(dataToSubmit).unwrap();
      // Assuming the API returns a token or user data
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.data?.message || "Failed to register. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create an Account
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
            value={userData.email}
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
            value={userData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="instrument-label">Instrument</InputLabel>
                <Select
                  labelId="instrument-label"
                  id="instrument"
                  name="instrument"
                  value={userData.instrument}
                  label="Instrument"
                  onChange={handleChange}
                >
                  {instruments.map((instrument) => (
                    <MenuItem key={instrument.id} value={instrument.id}>
                      {instrument.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="proficiency-label">Proficiency</InputLabel>
                <Select
                  labelId="proficiency-label"
                  id="proficiency"
                  name="proficiency"
                  value={userData.proficiency}
                  label="Proficiency"
                  onChange={handleChange}
                >
                  {proficiencyLevels.map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
