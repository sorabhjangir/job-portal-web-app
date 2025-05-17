import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null); // ✅ State for Job Modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data); // ✅ Fetch all jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on job type
  const filteredJobs = jobs.filter((job) =>
    filter === "All" ? true : job.jobType === filter
  );

  // Show only 3 jobs
  const displayedJobs = filteredJobs.slice(0, 3);

  return (
    <Container className="my-5">
      <h2 className="text-center fw-bold mb-4">Featured Jobs</h2>

      {/* Job Filter Buttons */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        {["All", "Full-Time", "Part-Time", "Internship"].map((type) => (
          <Button
            key={type}
            variant={filter === type ? "primary" : "outline-primary"}
            onClick={() => setFilter(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Job Cards */}
      <Row>
        {displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
            <Col md={4} key={job._id} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{job.title}</Card.Title>
                    <Card.Subtitle className="text-muted">{job.company}</Card.Subtitle>
                    <Card.Text>
                      <FaMapMarkerAlt className="text-danger me-2" />
                      {job.location} - {job.jobType}
                    </Card.Text>
                    <Button variant="primary" onClick={() => setSelectedJob(job)}>
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted mt-4">No jobs available.</p>
        )}
      </Row>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal show={true} onHide={() => setSelectedJob(null)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedJob.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Salary:</strong> ${selectedJob.salary}</p>
            <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => navigate(`/apply/${selectedJob._id}`)}>
              Apply Now
            </Button>
            <Button variant="secondary" onClick={() => setSelectedJob(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default FeaturedJobs;
