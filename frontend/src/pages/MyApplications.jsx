import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Card, Alert, Spinner } from "react-bootstrap";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view your applications.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(res.data);
      } catch (error) {
        toast.error("Error fetching applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center fw-bold">My Job Applications</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : applications.length > 0 ? (
        applications.map((job) => (
          <Card key={job._id} className="shadow-sm mt-3">
            <Card.Body>
              <Card.Title>{job.title}</Card.Title>
              <Card.Subtitle className="text-muted">{job.company}</Card.Subtitle>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ${job.salary}</p>
              <p><strong>Job Type:</strong> {job.jobType}</p>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info" className="text-center">
          You haven't applied for any jobs yet.
        </Alert>
      )}
    </Container>
  );
};

export default MyApplications;
