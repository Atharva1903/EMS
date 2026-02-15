const Attendance = require("../models/Attendance");

exports.markToday = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const existing = await Attendance.findOne({
      employeeId: req.user.id,
      date: { $gte: start, $lt: end }
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const record = await Attendance.create({
      employeeId: req.user.id,
      date: today,
      status: "Present"
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ employeeId: req.user.id })
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employeeId", "fullName email role")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

