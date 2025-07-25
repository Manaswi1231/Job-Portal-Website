import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Grid, Typography, Paper, TextField } from "@material-ui/core";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const Profile = () => {
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const getData = useCallback(() => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err.response?.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching profile",
        });
      });
  }, [setProfileDetails, setPhone, setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleUpdate = () => {
    const updatedDetails = {
      ...profileDetails,
      contactNumber: phone !== "" ? `+${phone}` : "",
    };

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Update failed",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Profile</Typography>
      </Grid>
      <Grid item xs style={{ width: "100%" }}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Name"
                value={profileDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Bio (up to 250 words)"
                multiline
                rows={8}
                variant="outlined"
                fullWidth
                value={profileDetails.bio}
                onChange={(event) => {
                  const wordCount = event.target.value
                    .split(" ")
                    .filter((word) => word !== "").length;
                  if (wordCount <= 250) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={handleUpdate}
          >
            Update Details
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
