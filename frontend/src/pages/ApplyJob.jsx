import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Form, Button, Alert } from "react-bootstrap";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    
    if (!userRole || userRole !== "jobseeker") {
      setMessage("Only job seekers can apply for jobs.");
      setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!name || !email || !resume) {
      setMessage("Please fill all fields and upload your resume.");
      return;
    }
  
    const formData = new FormData();
    formData.append("resume", resume);  // ✅ Ensure resume is being uploaded
  
    try {
      const token = localStorage.getItem("token"); // ✅ Get the stored auth token
      if (!token) {
        setMessage("You must be logged in to apply for jobs.");
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token for authentication
        credentials: "include",
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage("Application submitted successfully!");
        setTimeout(() => navigate("/MyApplications.jsx"), 3000);
      } else {
        setMessage(data.msg || "Failed to apply. Please try again.");
      }
    } catch (error) {
      setMessage("Error submitting application. Please try again.");
    }
  };
  
  return (
    <Container className="mt-5">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-4 border rounded shadow-sm bg-white"
      >
        <h2 className="text-primary text-center">Apply for Job</h2>
        <p className="text-center text-secondary">Job ID: {jobId}</p>

        {message && <Alert variant={message.includes("success") ? "success" : "danger"}>{message}</Alert>}

        {role === "jobseeker" ? (
          <Form onSubmit={handleApply} className="mt-4">
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </Form.Group>

            <Form.Group controlId="resume" className="mt-3">
              <Form.Label>Upload Resume</Form.Label>
              <Form.Control type="file" onChange={(e) => setResume(e.target.files[0])} required />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-4 w-100 py-2">
              Submit Application
            </Button>
          </Form>
        ) : (
          <Alert variant="danger" className="text-center mt-4">
            Only job seekers can apply for jobs. Redirecting...
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};

export default ApplyJob;
