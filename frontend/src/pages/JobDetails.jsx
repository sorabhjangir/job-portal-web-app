import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner, Alert, Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
  }, [id]);


  const handleApply = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("job-portal-token");
    if (!token) {
      setMessage("You must be logged in to apply.");
      return;
    }
  
    if (!resume) {
      setMessage("Please upload your resume.");
      return;
    }
  
    console.log("Applying for job:", id); // ✅ Debugging
    console.log("Selected Resume:", resume);
  
    const formData = new FormData();
    formData.append("resume", resume);
  
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });
  
      const data = await res.json();
      console.log("Server Response:", data); // ✅ Debugging
  
      if (res.ok) {
        setMessage("Application submitted successfully!");
      } else {
        setMessage(data.msg || "Failed to apply.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };
  
  

  if (loading) return <Spinner animation="border" role="status" className="d-block mx-auto mt-5" />;
  if (!job) return <p className="text-center mt-5">Job not found.</p>;

  return (
    <Container className="p-5">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-4 border rounded shadow-sm bg-white"
      >
        <h2 className="text-primary">{job.title}</h2>
        <p className="text-secondary">{job.company} - {job.location}</p>
        <p className="mt-3">{job.description}</p>
        <p className="font-weight-bold">Salary: ${job.salary}</p>

        <input
          type="file"
          className="form-control mt-3"
          onChange={(e) => setResume(e.target.files[0])}
        />

        <Button
          onClick={handleApply}
          className="mt-4 px-4 py-2"
          variant="primary"
          disabled={!resume}
        >
          Apply Now
        </Button>

        {message && <Alert variant={message.includes("success") ? "success" : "danger"} className="mt-3">{message}</Alert>}
      </motion.div>
    </Container>
  );
};

export default JobDetails;
