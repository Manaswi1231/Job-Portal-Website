// src/pages/Home.js

import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  "Software Engineer",
  "Data Analyst",
  "Web Developer",
  "UI/UX Designer",
  "Marketing Manager",
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/home?search=${encodeURIComponent(query)}`);
    }
  };

  const handleRoleClick = (role) => {
    navigate(`/home?search=${encodeURIComponent(role)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600 mb-8">
          Explore opportunities and apply to roles that match your passion.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center mb-10">
          <input
            type="text"
            name="search"
            placeholder="Search for jobs..."
            className="w-full max-w-md px-4 py-2 border rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Role Cards */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Explore Popular Roles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => handleRoleClick(role)}
              className="cursor-pointer bg-white shadow-md hover:shadow-xl rounded-xl p-6 transition duration-300 hover:bg-blue-50"
            >
              <h3 className="text-lg font-semibold text-gray-800">{role}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
