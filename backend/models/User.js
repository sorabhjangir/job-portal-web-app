const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "employer", "jobseeker"], 
    default: "jobseeker" 
  },
  googleId: { type: String, unique: true },
  avatar: { type: String },
  
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
