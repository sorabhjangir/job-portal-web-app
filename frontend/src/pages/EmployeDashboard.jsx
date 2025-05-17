import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const EmployeDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Not authenticated. Please log in.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/jobs/employer-jobs", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setJobs(res.data);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      }
    };

    fetchEmployerJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authenticated.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(jobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  return (
    <Container className="my-5">
      <motion.h2
        className="text-center text-dark fw-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Posted Jobs
      </motion.h2>

      {/* Empty State UI */}
      {jobs.length === 0 ? (
        <motion.div
          className="text-center text-dark bg-light p-4 rounded shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="fw-bold">You haven't posted any jobs yet!</h4>
          <p className="mb-4">Start posting now to attract top candidates.</p>
          <Link to="/post-job">
            <Button variant="primary" size="lg">
              ➕ Post a Job
            </Button>
          </Link>
        </motion.div>
      ) : (
        <Row >
          <AnimatePresence>
            {jobs.map((job) => (
              <Col md={6} lg={4} key={job._id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className=" shadow-lg border-0 p-3 job-card rounded">
                    <Card.Body>
                      <Card.Title className="fw-bold">{job.title}</Card.Title>
                      <Card.Text className="text-muted">{job.company}</Card.Text>
                      <Card.Text className="d-flex align-items-center">
                        📍 <span className="ms-2">{job.location}</span>
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-primary">{job.jobType}</span>
                        <span className="badge bg-secondary">${job.salary}</span>
                      </div>
                      <Button
                        variant="danger"
                        className="mt-3 w-100"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete Job
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>
      )}
    </Container>
  );
};

export default EmployeDashboard;
