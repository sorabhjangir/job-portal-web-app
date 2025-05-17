import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      (job.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (job.company?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return ( 
    <Container className="mt-4">
      <h2 className="text-center fw-bold">Explore Job Listings</h2>
      <Form.Control
        type="text"
        placeholder="Search for jobs..."
        className="my-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Row>
        {filteredJobs.map((job) => (
          <Col key={job._id} md={4} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    {job.company}
                  </Card.Subtitle>
                  <Card.Text>
                    {job.location} - {job.jobType}
                  </Card.Text>
                  <Button variant="primary" onClick={() => setSelectedJob(job)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      {/* Job Details Modal */}
      {selectedJob && (
        <Modal show={true} onHide={() => setSelectedJob(null)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedJob.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Company:</strong> {selectedJob.company}
            </p>
            <p>
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Salary:</strong> ${selectedJob.salary}
            </p>
            <p>
              <strong>Job Type:</strong> {selectedJob.jobType}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.description}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Link to={`/apply/${selectedJob._id}`}>
              <Button className="mt-4 px-4 py-2" variant="primary">
                Apply Now
              </Button>
            </Link>
            <Button variant="secondary" onClick={() => setSelectedJob(null) }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default JobList;
