// src/component/Login.js

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    if (!email || !password) {
      setErr("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );

      const { token, user } = response.data;
      localStorage.setItem("jwt", token);
      if (onLogin) onLogin(user);
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "90vh" }}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 24 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          {err && (
            <Alert severity="error" style={{ marginBottom: 16 }}>
              {err}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
