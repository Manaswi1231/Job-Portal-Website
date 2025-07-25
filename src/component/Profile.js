// src/component/Profile.js

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { name, email, bio, skills } = res.data;
          setProfile({ name, email, bio, skills: skills || [] });
        })
        .catch(() => setErr("Failed to load profile"));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(skillInput.trim())) {
        setProfile({
          ...profile,
          skills: [...profile.skills, skillInput.trim()],
        });
        setSkillInput("");
      }
    }
  };

  const handleSkillDelete = (deleted) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== deleted),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccess("");

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Profile updated successfully");
    } catch (error) {
      setErr(error?.response?.data?.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <Grid container justifyContent="center" style={{ minHeight: "90vh" }}>
      <Grid item xs={10} sm={6} md={5}>
        <Paper elevation={3} style={{ padding: 24 }}>
          <Typography variant="h5" gutterBottom>
            Update Profile
          </Typography>

          {err && (
            <Alert severity="error" style={{ marginBottom: 16 }}>
              {err}
            </Alert>
          )}
          {success && (
            <Alert severity="success" style={{ marginBottom: 16 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />

            <TextField
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              margin="normal"
            />

            <TextField
              label="Skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillAdd}
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Type skill and press Enter"
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {profile.skills.map((skill) => (
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
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
