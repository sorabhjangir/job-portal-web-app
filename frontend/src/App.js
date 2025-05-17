import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import EmployeDashboard from "./pages/EmployeDashboard";
import PostJob from "./pages/PostJob";
import ApplyJob from "./pages/ApplyJob";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="container-fluid p-0 ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job-listings" element={<JobListings />} />
        <Route path="/job/:id" element={<JobDetails />} />
        
        {/* Jobseeker Routes */}
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />

        {/* Employer Routes */}
        <Route path="/employer-dashboard" element={<EmployeDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
