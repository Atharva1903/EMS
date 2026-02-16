const Employee = require("../models/Employee");
const mongoose = require("mongoose");

exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("userId", "fullName email role");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("userId", "fullName email role");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getEmployeeCount = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "Active" });
    const interns = await Employee.countDocuments({ employmentType: "Intern" }); // Fixed to use employmentType
    const fullTime = await Employee.countDocuments({ employmentType: "Full-time" }); // Fixed to use employmentType

    // New Joinees this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newJoinees = await Employee.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const departmentWise = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    res.json({
      totalEmployees,
      activeEmployees,
      interns,
      fullTime,
      newJoinees,
      departmentWise
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= PROFILE (LOGGED IN EMPLOYEE) =================
exports.getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const employee = await Employee.findOne({ userId }).populate("userId", "fullName email role");

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // Attendance Stats (Current Month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const Attendance = require("../models/Attendance");
    const presentDays = await Attendance.countDocuments({
      employeeId: userId,
      status: "Present",
      date: { $gte: startOfMonth }
    });

    const absentDays = await Attendance.countDocuments({
      employeeId: userId,
      status: "Absent",
      date: { $gte: startOfMonth }
    });

    // Leave Stats
    const Leave = require("../models/Leave");
    const leaveStats = await Leave.aggregate([
      { $match: { employeeId: new mongoose.Types.ObjectId(userId) } }, // Ensure ObjectId
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Payroll History (Last 3)
    const Payroll = require("../models/Payroll");
    const payrollHistory = await Payroll.find({ employeeId: userId })
      .sort({ year: -1, month: -1 })
      .limit(3);

    res.json({
      employee,
      stats: {
        attendance: { present: presentDays, absent: absentDays },
        leaves: leaveStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      },
      payrollHistory
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, dob, mobile, address } = req.body;

    // Update User (fullName)
    const User = require("../models/User");
    await User.findByIdAndUpdate(userId, { fullName });

    // Update Employee (Details)
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId },
      { dob, mobile, address },
      { new: true }
    ).populate("userId", "fullName email role");

    res.json(updatedEmployee);

  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
