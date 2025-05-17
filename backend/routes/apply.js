const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// Set up Multer for file uploads (storing resumes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to check if user is a job seeker
const isJobSeeker = (req, res, next) => {
  if (!req.cookies || !req.cookies.role || req.cookies.role !== "jobseeker") {
    return res.status(403).json({ error: "Only job seekers can apply for jobs." });
  }
  next();
};

// Job Application Route (Only for Job Seekers)
router.post("/", isJobSeeker, upload.single("resume"), async (req, res) => {
  try {
    const { jobId, name, email } = req.body;
    const resumePath = req.file ? req.file.path : null;

    if (!jobId || !name || !email || !resumePath) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const application = new JobApplication({
      jobId,
      name,
      email,
      resume: resumePath,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
