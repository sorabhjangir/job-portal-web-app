const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Job" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resume: { type: String, required: true }, // Path to uploaded file
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
