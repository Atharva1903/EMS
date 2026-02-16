const router = require("express").Router();
const {
  createPayroll,
  getAllPayroll,
  getMyPayroll,
  getPayrollStats,
  runBulkPayroll,
  updatePayrollStatus,
  deletePayroll,
  deleteAllPayrolls
} = require("../controllers/payrollController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin create payroll
router.post("/", authMiddleware, roleMiddleware("admin"), createPayroll);
router.post("/run-bulk", authMiddleware, roleMiddleware("admin"), runBulkPayroll);
router.put("/:id/pay", authMiddleware, roleMiddleware("admin"), updatePayrollStatus);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deletePayroll);
router.delete("/", authMiddleware, roleMiddleware("admin"), deleteAllPayrolls);

// Admin view all payroll
router.get("/", authMiddleware, roleMiddleware("admin"), getAllPayroll);

// Employee view own payroll
router.get("/my", authMiddleware, roleMiddleware("employee"), getMyPayroll);

module.exports = router;
router.get("/stats", authMiddleware, roleMiddleware("admin"), getPayrollStats);
