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
    const total = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: "Pending" });

    res.json({
      totalLeaves: total,
      pendingLeaves: pending
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
