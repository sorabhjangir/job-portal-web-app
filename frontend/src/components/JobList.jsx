import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4 text-primary">Explore Job Listings</h2>
      
      {jobs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-warning text-center"
        >
          No jobs available at the moment.
        </motion.div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <motion.div 
              key={job._id} 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card h-100 shadow-lg border-0 rounded">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark">{job.title}</h5>
                  <p className="card-text text-muted"><strong>Company:</strong> {job.company}</p>
                  <p className="card-text"><strong>Location:</strong> {job.location}</p>
                  <p className="card-text text-success fw-bold"><strong>Salary:</strong> ${job.salary.toLocaleString()}</p>
                  <p className="badge bg-info text-dark p-2">{job.jobType}</p>
                  <p className="card-text text-secondary mt-2">{job.description.substring(0, 100)}...</p>
                  <a href={`/apply/${job._id}`} className="btn btn-primary w-100 mt-2 fw-bold">
                    Apply Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
