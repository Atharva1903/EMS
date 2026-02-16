const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");

const calculateLopAmount = (salary, leaves) => {
  const dailyRate = salary / 30;
  let lopDays = 0;

  leaves.forEach((leave) => {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    const days =
      Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let factor = 0;
    if (leave.leaveType === "Paid") factor = 0;
    else if (leave.leaveType === "Sick") factor = 0.5;
    else factor = 1;
    lopDays += days * factor;
  });

  return Math.round(dailyRate * lopDays);
};

exports.createPayroll = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      bonus,
      deductions
    } = req.body;

    const base = basicSalary;
    const hra = Math.round(base * 0.4);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const leaves = await Leave.find({
      employeeId,
      status: "Approved",
      fromDate: { $lt: end },
      toDate: { $gte: start }
    });

    const lopAmount = calculateLopAmount(base, leaves);
    const grossSalary = base + bonus + hra;
    const netSalary = grossSalary - deductions - lopAmount;

    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      basicSalary: base,
      bonus,
      hra,
      deductions,
      lopAmount,
      grossSalary,
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
  try {
    const { month, year } = req.query;
    let query = {};
    if (month && year) {
      query = { month: Number(month), year: Number(year) };
    }

    const totalPayrolls = await Payroll.countDocuments(query);

    const paymentStats = await Payroll.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentStatus",
          totalAmount: { $sum: "$netSalary" },
          count: { $sum: 1 }
        }
      }
    ]);

    const paid = paymentStats.find(p => p._id === "Paid");
    const pending = paymentStats.find(p => p._id === "Pending");

    const totalSalaryExpense = (paid ? paid.totalAmount : 0) + (pending ? pending.totalAmount : 0);

    res.json({
      totalPayrolls,
      totalPaid: paid ? paid.totalAmount : 0,
      totalPending: pending ? pending.totalAmount : 0, // Upcoming Salary Releases
      paidCount: paid ? paid.count : 0,
      pendingCount: pending ? pending.count : 0,
      totalSalaryExpense
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.runBulkPayroll = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const employees = await Employee.find().populate("userId", "fullName");

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const leaves = await Leave.find({
      status: "Approved",
      fromDate: { $lt: end },
      toDate: { $gte: start }
    });

    const leavesByEmployee = {};
    leaves.forEach((leave) => {
      const key = String(leave.employeeId);
      if (!leavesByEmployee[key]) leavesByEmployee[key] = [];
      leavesByEmployee[key].push(leave);
    });

    const results = [];

    for (const emp of employees) {
      if (!emp.salary) continue;

      const existing = await Payroll.findOne({
        employeeId: emp.userId,
        month,
        year
      });

      if (existing) continue;

      const base = emp.salary;
      const bonus = 0;
      const deductions = 0;
      const hra = Math.round(base * 0.4);

      const relatedLeaves = leavesByEmployee[String(emp.userId)] || [];
      const lopAmount = calculateLopAmount(base, relatedLeaves);

      const grossSalary = base + bonus + hra;
      const netSalary = grossSalary - deductions - lopAmount;

      const payroll = await Payroll.create({
        employeeId: emp.userId,
        month,
        year,
        basicSalary: base,
        bonus,
        hra,
        deductions,
        lopAmount,
        grossSalary,
        netSalary
      });

      results.push(payroll);
    }

    res.json({
      generated: results.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    payroll.paymentStatus = "Paid";
    await payroll.save();
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    await payroll.deleteOne();
    res.json({ message: "Payroll deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAllPayrolls = async (req, res) => {
  try {
    await Payroll.deleteMany({});
    res.json({ message: "All payroll records deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
