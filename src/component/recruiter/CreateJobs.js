import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const CreateJobs = () => {
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    axios
      .post(apiList.jobs, jobDetails, {
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
        // Reset form after creation
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error creating job",
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
      <Typography variant="h2" gutterBottom>
        Add Job
      </Typography>

      <Grid item xs style={{ width: "100%", maxWidth: 600 }}>
        <Paper style={{ padding: "20px" }}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <TextField
                label="Title"
                value={jobDetails.title}
                onChange={(e) => handleInput("title", e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item>
              <ChipInput
                label="Skills"
                variant="outlined"
                helperText="Press enter to add skills"
                value={jobDetails.skillsets}
                onAdd={(chip) =>
                  setJobDetails({
                    ...jobDetails,
                    skillsets: [...jobDetails.skillsets, chip],
                  })
                }
                onDelete={(chip, index) => {
                  const skillsets = [...jobDetails.skillsets];
                  skillsets.splice(index, 1);
                  setJobDetails({ ...jobDetails, skillsets });
                }}
                fullWidth
              />
            </Grid>

            <Grid item>
              <TextField
                select
                label="Job Type"
                variant="outlined"
                value={jobDetails.jobType}
                onChange={(e) => handleInput("jobType", e.target.value)}
                fullWidth
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Work From Home">Work From Home</MenuItem>
              </TextField>
            </Grid>

            <Grid item>
              <TextField
                select
                label="Duration"
                variant="outlined"
                value={jobDetails.duration}
                onChange={(e) => handleInput("duration", e.target.value)}
                fullWidth
              >
                <MenuItem value={0}>Flexible</MenuItem>
                {[1, 2, 3, 4, 5, 6].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month} Month{month > 1 ? "s" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item>
              <TextField
                label="Salary"
                type="number"
                variant="outlined"
                value={jobDetails.salary}
                onChange={(e) => handleInput("salary", e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </Grid>

            <Grid item>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline}
                onChange={(e) => handleInput("deadline", e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(e) => handleInput("maxApplicants", e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>

            <Grid item>
              <TextField
                label="Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(e) => handleInput("maxPositions", e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={handleUpdate}
          >
            Create Job
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;
