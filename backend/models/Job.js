const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  salary: Number,
  jobType: { 
    type: String, 
    enum: ["Full-Time", "Part-Time", "Internship"],  // ✅ Only allow these values
    required: true 
  },  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Ensure required
  applicants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      resume: String,
    },
  ],
});

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
