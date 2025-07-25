import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
  TextField,
  Modal,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";

const useStyles = makeStyles(() => ({
  jobTileOuter: {
    padding: "20px",
    margin: "20px 0",
    backgroundColor: "#ffffff", // white background
  },
  button: {
    width: "100%",
  },
  popupDialog: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const userType = () => localStorage.getItem("type");

const Home = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobs, setJobs] = useState([]);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sop, setSop] = useState("");

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpenApplyModal(true);
  };

  const handleClose = () => {
    setOpenApplyModal(false);
    setSop("");
  };

  const handleApply = () => {
    if (!selectedJob) return;

    axios
      .post(
        `${apiList.jobs}/${selectedJob._id}/applications`,
        { sop },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err?.response?.data?.message || "Failed to apply",
        });
        handleClose();
      });
  };

  const handleSaveJob = (jobId) => {
    axios
      .post(
        `${apiList.jobs}/${jobId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setPopup({
          open: true,
          severity: "success",
          message: "Job saved successfully!",
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err?.response?.data?.message || "Could not save job",
        });
      });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:4444/api/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    getData();
  }, []);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Grid item xs={12} md={8}>
        {jobs.length === 0 ? (
          <Typography variant="h6">No jobs available.</Typography>
        ) : (
          jobs.map((job, idx) => {
            const deadline = new Date(job.deadline).toLocaleDateString();
            return (
              <Paper className={classes.jobTileOuter} key={idx} elevation={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9}>
                    <Typography variant="h5">{job.title}</Typography>
                    <Rating
                      value={job.rating !== -1 ? job.rating : null}
                      readOnly
                    />
                    <Typography>Role: {job.jobType}</Typography>
                    <Typography>Salary: ₹{job.salary} per month</Typography>
                    <Typography>
                      Duration:{" "}
                      {job.duration !== 0
                        ? `${job.duration} months`
                        : "Flexible"}
                    </Typography>
                    <Typography>Posted by: {job.recruiter.name}</Typography>
                    <Typography>Deadline: {deadline}</Typography>
                    <div style={{ marginTop: 8 }}>
                      {job.skillsets.map((skill, i) => (
                        <Chip
                          key={i}
                          label={skill}
                          style={{ marginRight: "5px", marginBottom: "5px" }}
                        />
                      ))}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={3}
                    container
                    direction="column"
                    spacing={2}
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => handleApplyClick(job)}
                        disabled={userType() === "recruiter"}
                      >
                        Apply
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.button}
                        startIcon={<BookmarkBorderIcon />}
                        onClick={() => handleSaveJob(job._id)}
                        disabled={userType() === "recruiter"}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            );
          })
        )}
      </Grid>

      <Modal
        open={openApplyModal}
        onClose={handleClose}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (up to 250 words)"
            multiline
            rows={8}
            variant="outlined"
            style={{ width: "100%", marginBottom: "20px" }}
            value={sop}
            onChange={(e) => {
              const words = e.target.value.split(" ").filter((w) => w !== "");
              if (words.length <= 250) {
                setSop(e.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            style={{ padding: "10px 50px" }}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Home;
