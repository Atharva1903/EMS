const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  hra: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  lopAmount: {
    type: Number,
    default: 0
  },
  grossSalary: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payroll", payrollSchema);
