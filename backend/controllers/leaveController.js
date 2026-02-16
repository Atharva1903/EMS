const Leave = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      employeeId: req.user.id, // auto from token
      ...req.body
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "fullName email role");

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getLeaveStats = async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: "Pending" });
    const rejectedLeaves = await Leave.countDocuments({ status: "Rejected" });

    // Employees currently on leave
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employeesOnLeave = await Leave.countDocuments({
      status: "Approved",
      fromDate: { $lte: today },
      toDate: { $gte: today }
    });

    const leaveStatusBreakdown = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      totalLeaves,
      pendingLeaves,
      rejectedLeaves,
      employeesOnLeave,
      leaveStatusBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee's own leaves with stats
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all leaves for this employee
    const leaves = await Leave.find({ employeeId: userId })
      .sort({ createdAt: -1 });

    // Calculate stats
    const total = leaves.length;
    const pending = leaves.filter(l => l.status === "Pending").length;
    const approved = leaves.filter(l => l.status === "Approved").length;
    const rejected = leaves.filter(l => l.status === "Rejected").length;

    // Get last applied leave
    const lastApplied = leaves.length > 0 ? leaves[0] : null;

    res.json({
      leaves,
      stats: {
        total,
        pending,
        approved,
        rejected
      },
      lastApplied
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
