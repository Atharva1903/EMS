const Payroll = require("../models/Payroll");

// Admin generates payroll
exports.createPayroll = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, bonus, deductions } = req.body;

    const netSalary = basicSalary + bonus - deductions;

    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      basicSalary,
      bonus,
      deductions,
      netSalary
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin view all payroll
exports.getAllPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "fullName email role");

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Employee view own payroll
exports.getMyPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({
      employeeId: req.user.id
    });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getPayrollStats = async (req, res) => {
  const count = await Payroll.countDocuments();
  res.json({ totalPayrolls: count });
};