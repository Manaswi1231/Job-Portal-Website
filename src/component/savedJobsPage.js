// src/component/SavedJobsPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get("/api/saved-jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching saved jobs", error);
      }
    };

    fetchSavedJobs();
  }, []);

  return (
    <div>
      <h2>Saved Jobs</h2>
      {jobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id}>
            <h4>{job.title}</h4>
            <p>{job.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobsPage;
