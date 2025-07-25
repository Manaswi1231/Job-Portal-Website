// Welcome.js
import React from "react";
import "./Welcome.css";

const Welcome = () => {
  return (
    <section className="hero-section">
      <div className="hero-badge">No. 1 Job Hunt Website</div>
      <h1 className="hero-title">
        Search, Apply & <br /> Get Your{" "}
        <span className="highlight">Dream Jobs</span>
      </h1>
      <p className="hero-subtitle">
        Explore thousands of jobs and opportunities. Your career journey begins
        here.
      </p>

      <div className="search-container">
        <input type="text" placeholder="Find your dream jobs" />
        <button className="search-btn">🔍</button>
      </div>

      <div className="category-buttons">
        <button>Frontend Developer</button>
        <button>Backend Developer</button>
        <button>Data Science</button>
      </div>
    </section>
  );
};

export default Welcome;
