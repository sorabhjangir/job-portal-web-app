import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaFileAlt, FaHandshake } from "react-icons/fa";
import FeaturedJobs from "./FeaturedJobs";

const Home = () => {
  const navigate = useNavigate(); // ✅ Navigation Hook

const [searchQuery, setSearchQuery] = useState("");  
const [locationQuery, setLocationQuery] = useState("");
const [jobTypeQuery, setJobTypeQuery] = useState("");
const [jobs, setJobs] = useState([]);  

   // ✅ Function to Fetch Jobs Based on Search Criteria
   const fetchJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs`, {
        params: {
          search: searchQuery,
          location: locationQuery,
          jobType: jobTypeQuery,
        },
      });
      setJobs(res.data); // Update jobs state with fetched data
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
    // Handle Popular Search Click
    const handlePopularSearch = (category) => {
      setSearchQuery(category);
      fetchJobs();
    };
  // ✅ Fetch all jobs when the page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="hero-section text-white text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">Find Your Dream Job Today</h1>
          <p className="fs-5 mt-3">
            Search thousands of jobs from top companies and find the perfect match for your skills.
          </p>

          {/* Search Bar */}
          <div className="search-bar bg-white p-3 rounded shadow d-flex justify-content-center mt-4">
            <Form.Control type="text" placeholder="Job title, keywords, or company" className="me-2 flex-grow-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  />
            {/* <Form.Control 
              type="text" 
              placeholder="City, state, or remote" 
              className="me-2 flex-grow-1"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            /> */}
            <Form.Select 
              className="me-2 flex-grow-1"
              value={jobTypeQuery}
              onChange={(e) => setJobTypeQuery(e.target.value)}
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </Form.Select>
            <Button variant="primary" onClick={fetchJobs}>Search Jobs</Button>
          </div>
    {/* Popular Searches */}
    <div className="popular-searches mt-4 text-center">
          <span className="fw-semibold">Popular searches:</span>
          {["Software Developer", "Marketing", "Remote", "Data Analyst", "Healthcare"].map((category, index) => (
            <Button
              key={index}
              variant="outline-primary"
              size="sm"
              className="ms-2 bg-transparent border text-white"
              onClick={() => handlePopularSearch(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        </Container>
      </section>

      {/* Browse Job Categories */}
      <section className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-4">Search Results</h2>
        <Row className="g-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Col md={4} key={job._id}>
                <div className="category-box p-4 border rounded text-center shadow-sm bg-white">
                  <h5 className="fw-bold">{job.title}</h5>
                  <p className="text-muted">{job.company}</p>
                  <p><strong>📍 Location:</strong> {job.location}</p>
                    <p><strong>💼 Job Type:</strong> {job.jobType}</p>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/job/${job._id}`)}>
                    View Details
                  </Button>
                </div>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">No jobs found.</p>
          )}
        </Row>
      </Container>
    </section>

      {/* Featured Jobs */}
      <FeaturedJobs /> 

      {/* How Job Portal Works */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-4">How Our Job Portal Works</h2>
          <Row className="g-4 text-center">
            {[
              { icon: <FaSearch size={50} className="text-primary" />, title: "Search Jobs", description: "Find your dream job by searching from thousands of listings." },
              { icon: <FaFileAlt size={50} className="text-success" />, title: "Apply for Jobs", description: "Submit your resume and apply for the positions you like." },
              { icon: <FaHandshake size={50} className="text-warning" />, title: "Get Hired", description: "Get hired by top companies and start your new career." },
            ].map((step, index) => (
              <Col key={index} md={4}>
                <div className="how-it-works-box p-4 border rounded shadow-sm bg-light">
                  <div className="icon mb-3">{step.icon}</div>
                  <h5 className="fw-bold">{step.title}</h5>
                  <p className="text-muted">{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>

          {/* 🚀 New Get Started Button */}
          <div className="text-center mt-5">
            <Button 
              variant="primary" 
              size="lg" 
              className="px-5 py-3 fw-bold"
              onClick={() => navigate("/register")} // ✅ Navigate to Register
            >
              Get Started →
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;

