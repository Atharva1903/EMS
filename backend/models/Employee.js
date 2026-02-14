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
  joiningDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
