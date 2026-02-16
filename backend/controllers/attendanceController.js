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
    const { month, year } = req.query;
    let query = { employeeId: req.user.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 });
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

exports.getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "Present"
    });

    // Active employees to calculate absent
    const Employee = require("../models/Employee");
    const activeEmployees = await Employee.countDocuments({ status: "Active" });

    // Employees on leave today
    const Leave = require("../models/Leave");
    const onLeaveToday = await Leave.countDocuments({
      status: "Approved",
      fromDate: { $lte: today },
      toDate: { $gte: today }
    });

    const absentToday = activeEmployees - presentToday - onLeaveToday;

    // Attendance % for this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const totalPresentMonth = await Attendance.countDocuments({
      createdAt: { $gte: startOfMonth },
      status: "Present"
    });

    // Very rough estimate for %: Total Present / (Active * DaysPassed)
    // For more accuracy we'd need exact working days but this suffices for a dashboard summary
    const daysPassed = today.getDate();
    const totalPossibleAttendance = activeEmployees * daysPassed;
    const attendancePercentage = totalPossibleAttendance > 0
      ? ((totalPresentMonth / totalPossibleAttendance) * 100).toFixed(1)
      : 0;

    res.json({
      presentToday,
      absentToday: absentToday < 0 ? 0 : absentToday,
      attendancePercentage,
      totalActive: activeEmployees
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

