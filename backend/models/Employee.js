const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: String,
  designation: String,
  salary: Number,
  joiningDate: Date,
  dob: Date,
  mobile: String,
  address: String,
  employmentType: {
    type: String,
    enum: ["Intern", "Full-time"],
    default: "Full-time"
  },
  status: {
    type: String,
    enum: ["Active", "On Leave"],
    default: "Active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
