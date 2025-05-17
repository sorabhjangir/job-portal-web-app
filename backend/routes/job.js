const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ POST - Create a new Job (Employers only)
router.post("/", authMiddleware, roleMiddleware(["employer"]), async (req, res) => {
  try {
    console.log("User attempting to post a job:", req.user); // Debugging

    const { title, description, location, salary, jobType, company } = req.body;

    if (!title || !description || !location || !salary || !jobType || !company) {
      return res.status(400).json({ msg: "Please provide all job details" });
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      company,
      employer: req.user.id, // ✅ Ensure employer ID is stored
    });

    await newJob.save();
    console.log("✅ Job posted successfully:", newJob);
    res.status(201).json({ msg: "Job posted successfully!", job: newJob });

  } catch (error) {
    console.error("❌ Error posting job:", error);
    res.status(500).json({ msg: "Server error" });
  }
});



// ✅ GET - List all Jobs
router.get("/", async (req, res) => { 
  try {
    console.log("Fetching jobs from database...");

    const { search, location, jobType } = req.query; // ✅ Capture query params

    let query = {}; // Default: fetch all jobs

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },  // Search by job title
        { company: { $regex: search, $options: "i" } }, // Search by company
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" }; // Search by location
    }

    if (jobType) {
      query.jobType = jobType; // Search by job type (Exact Match)
    }

    const jobs = await Job.find(query).populate("employer", "name email");
    console.log("Jobs fetched successfully:", jobs);

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});



router.get("/employer-jobs", authMiddleware, roleMiddleware(["employer"]), async (req, res) => {
  try {
    console.log("Fetching jobs posted by employer:", req.user.id); // Debugging log

    const jobs = await Job.find({ employer: req.user.id }); // ✅ Fetch only employer's jobs

    if (!jobs.length) {
      return res.status(404).json({ msg: "No jobs found for this employer." });
    }

    res.json(jobs);
  } catch (error) {
    console.error("❌ Error fetching employer jobs:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ DELETE - Remove a job by Employer
router.delete("/:id", authMiddleware, roleMiddleware(["employer"]), async (req, res) => {
  try {
    console.log("🔹 DELETE request received for job:", req.params.id);
    console.log("🔹 Authenticated Employer ID:", req.user.id);

    const job = await Job.findById(req.params.id);
    console.log("🔍 Fetched Job Data:", job); // Debugging

    if (!job) {
      console.log("❌ Job not found!");
      return res.status(404).json({ msg: "Job not found" });
    }

    if (!job.employer) {
      console.log("❌ Job has no employer field!");
      return res.status(400).json({ msg: "Job data is corrupted (missing employer)" });
    }

    if (job.employer.toString() !== req.user.id) {
      console.log("❌ Unauthorized attempt to delete job!");
      return res.status(403).json({ msg: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    console.log("✅ Job deleted successfully!");
    res.json({ msg: "Job deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ GET - Fetch a single Job by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching job with ID:", req.params.id);

    const job = await Job.findById(req.params.id).populate("employer", "name email");

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error("❌ Error fetching job details:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ POST - Apply for a Job (Job Seekers with Resume Upload)
router.post(
  "/:id/apply",
  authMiddleware,
  roleMiddleware(["jobseeker"]),
  upload.single("resume"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ msg: "Job not found" });

      // ✅ Prevent duplicate applications
      const alreadyApplied = job.applicants.some(
        (applicant) => applicant.user.toString() === req.user.id
      );
      if (alreadyApplied) {
        return res.status(400).json({ msg: "You have already applied for this job" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "Resume is required" });
      }

      const resumePath = req.file.path;

      // ✅ Save application details
      job.applicants.push({ user: req.user.id, resume: resumePath });
      await job.save();

      res.json({ msg: "Job application submitted successfully!", resume: resumePath });
    } catch (error) {
      console.error("Error applying for job:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
