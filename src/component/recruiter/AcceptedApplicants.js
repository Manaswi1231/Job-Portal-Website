// ✅ Imports
import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
  Avatar,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";
import axios from "axios";

// ✅ FilterPopup component
const FilterPopup = ({
  open,
  handleClose,
  searchOptions,
  setSearchOptions,
  getData,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
          margin: "auto",
          marginTop: "10vh",
        }}
      >
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h5">Sort By</Typography>
          </Grid>

          {/* Sort by Name */}
          <Grid item container spacing={1} alignItems="center">
            <Checkbox
              checked={searchOptions.sort["jobApplicant.name"].status}
              onChange={(e) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.name": {
                      ...searchOptions.sort["jobApplicant.name"],
                      status: e.target.checked,
                    },
                  },
                })
              }
            />
            <Typography>Name</Typography>
            <IconButton
              disabled={!searchOptions.sort["jobApplicant.name"].status}
              onClick={() =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.name": {
                      ...searchOptions.sort["jobApplicant.name"],
                      desc: !searchOptions.sort["jobApplicant.name"].desc,
                    },
                  },
                })
              }
            >
              {searchOptions.sort["jobApplicant.name"].desc ? (
                <ArrowDownwardIcon />
              ) : (
                <ArrowUpwardIcon />
              )}
            </IconButton>
          </Grid>

          {/* Sort by Rating */}
          <Grid item container spacing={1} alignItems="center">
            <Checkbox
              checked={searchOptions.sort["jobApplicant.rating"].status}
              onChange={(e) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.rating": {
                      ...searchOptions.sort["jobApplicant.rating"],
                      status: e.target.checked,
                    },
                  },
                })
              }
            />
            <Typography>Rating</Typography>
            <IconButton
              disabled={!searchOptions.sort["jobApplicant.rating"].status}
              onClick={() =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    "jobApplicant.rating": {
                      ...searchOptions.sort["jobApplicant.rating"],
                      desc: !searchOptions.sort["jobApplicant.rating"].desc,
                    },
                  },
                })
              }
            >
              {searchOptions.sort["jobApplicant.rating"].desc ? (
                <ArrowDownwardIcon />
              ) : (
                <ArrowUpwardIcon />
              )}
            </IconButton>
          </Grid>

          {/* Sort by Date of Joining */}
          <Grid item container spacing={1} alignItems="center">
            <Checkbox
              checked={searchOptions.sort.dateOfJoining.status}
              onChange={(e) =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    dateOfJoining: {
                      ...searchOptions.sort.dateOfJoining,
                      status: e.target.checked,
                    },
                  },
                })
              }
            />
            <Typography>Date of Joining</Typography>
            <IconButton
              disabled={!searchOptions.sort.dateOfJoining.status}
              onClick={() =>
                setSearchOptions({
                  ...searchOptions,
                  sort: {
                    ...searchOptions.sort,
                    dateOfJoining: {
                      ...searchOptions.sort.dateOfJoining,
                      desc: !searchOptions.sort.dateOfJoining.desc,
                    },
                  },
                })
              }
            >
              {searchOptions.sort.dateOfJoining.desc ? (
                <ArrowDownwardIcon />
              ) : (
                <ArrowUpwardIcon />
              )}
            </IconButton>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                getData();
                handleClose();
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

// ✅ ApplicationTile component
const ApplicationTile = ({ application, getData }) => {
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.jobApplicant.rating);

  const updateRating = () => {
    axios
      .put(
        apiList.rating,
        {
          rating: rating,
          applicantId: application.jobApplicant.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        getData();
        setOpen(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Rating update failed",
        });
        setOpen(false);
      });
  };

  const downloadResume = () => {
    if (application.jobApplicant.resume) {
      const address = `${server}${application.jobApplicant.resume}`;
      axios(address, {
        method: "GET",
        responseType: "blob",
      }).then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume available",
      });
    }
  };

  return (
    <Paper style={{ margin: "20px 0", padding: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Avatar
            src={`${server}${application.jobApplicant.profile}`}
            style={{ width: 80, height: 80 }}
          />
        </Grid>
        <Grid item xs={7}>
          <Typography variant="h6">{application.jobApplicant.name}</Typography>
          <Rating value={rating !== -1 ? rating : null} readOnly />
          <Typography variant="body2">
            Job Title: {application.job.title}
          </Typography>
          <Typography variant="body2">
            Role: {application.job.jobType}
          </Typography>
          <Typography variant="body2">
            SOP: {application.sop || "Not submitted"}
          </Typography>
          <div style={{ marginTop: 8 }}>
            {application.jobApplicant.skills.map((skill, i) => (
              <Chip key={i} label={skill} style={{ marginRight: 4 }} />
            ))}
          </div>
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={downloadResume}
          >
            View Resume
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpen(true)}
            style={{ marginTop: 10 }}
          >
            Rate
          </Button>
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          style={{
            margin: "auto",
            marginTop: "20vh",
            padding: "30px",
            width: 300,
            textAlign: "center",
          }}
        >
          <Typography>Rate this applicant</Typography>
          <Rating
            value={rating === -1 ? null : rating}
            onChange={(e, newValue) => setRating(newValue)}
            style={{ marginBottom: 20 }}
          />
          <Button variant="contained" color="primary" onClick={updateRating}>
            Submit Rating
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

// ✅ AcceptedApplicants component
const AcceptedApplicants = () => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    sort: {
      "jobApplicant.name": { status: false, desc: false },
      "jobApplicant.rating": { status: false, desc: false },
      dateOfJoining: { status: true, desc: true },
    },
  });

  const getData = useCallback(() => {
    let query = ["status=accepted"];
    const { sort } = searchOptions;

    for (const key in sort) {
      if (sort[key].status) {
        query.push(`${sort[key].desc ? "desc" : "asc"}=${key}`);
      }
    }

    axios
      .get(`${apiList.applicants}?${query.join("&")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        console.log(err);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching applicants",
        });
      });
  }, [searchOptions, setApplications, setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Typography variant="h3">Accepted Applicants</Typography>
      <IconButton onClick={() => setFilterOpen(true)}>
        <FilterListIcon />
      </IconButton>

      {applications.length > 0 ? (
        applications.map((app, index) => (
          <ApplicationTile key={index} application={app} getData={getData} />
        ))
      ) : (
        <Typography variant="body1">No accepted applicants found.</Typography>
      )}

      <FilterPopup
        open={filterOpen}
        handleClose={() => setFilterOpen(false)}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        getData={getData}
      />
    </Grid>
  );
};

export default AcceptedApplicants;
