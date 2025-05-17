const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Job = require("../models/Job");

const router = express.Router();

// ✅ GET - Fetch Applied Jobs for the Logged-in User
router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching applications for:", req.user.id);

    // ✅ Find jobs where the logged-in user has applied
    const appliedJobs = await Job.find({ "applicants.user": req.user.id })
      .populate("employer", "name email")
      .select("title company location salary jobType");

    console.log("Applied jobs:", appliedJobs);

    res.json(appliedJobs);
  } catch (error) {
    console.error("❌ Error fetching applied jobs:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ GET - Fetch User Profile & Dashboard Data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let data = { user };

    if (user.role === "employer") {
      data.jobsPosted = await Job.find({ employer: req.user.id });
    } else if (user.role === "jobseeker") {
      data.appliedJobs = await Job.find({ "applicants.user": req.user.id }).select("title location");
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ PUT - Update User Profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, bio, company } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (user.role === "employer" && company) user.company = company;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
