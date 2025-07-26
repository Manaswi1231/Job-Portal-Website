// src/component/Signup.js

import React, { useState } from "react";
import {
  TextField,
  Chip,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { Alert } from "@material-ui/lab";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const handleSkillDelete = (deletedSkill) => {
    setSkills(skills.filter((skill) => skill !== deletedSkill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        {
          ...formData,
          skills,
        }
      );

      console.log(response.data); // Replace this with redirect or state update
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed");
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
      <Grid item xs={10} sm={6} md={5}>
        <Paper elevation={3} style={{ padding: 24 }}>
          <Typography variant="h5" gutterBottom>
            Signup
          </Typography>

          {err && (
            <Alert severity="error" style={{ marginBottom: 16 }}>
              {err}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Name"
              name="name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Chip Input Replacement */}
            <TextField
              label="Skills"
              fullWidth
              variant="outlined"
              margin="normal"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type skill and press Enter"
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleSkillDelete(skill)}
                  color="primary"
                />
              ))}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              style={{ marginTop: 24 }}
            >
              {loading ? <CircularProgress size={24} /> : "Signup"}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Signup;
