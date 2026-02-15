const router = require("express").Router();
const {
  createPayroll,
  getAllPayroll,
  getMyPayroll,
  getPayrollStats
} = require("../controllers/payrollController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin create payroll
router.post("/", authMiddleware, roleMiddleware("admin"), createPayroll);

// Admin view all payroll
router.get("/", authMiddleware, roleMiddleware("admin"), getAllPayroll);

// Employee view own payroll
router.get("/my", authMiddleware, roleMiddleware("employee"), getMyPayroll);

module.exports = router;
router.get("/stats", authMiddleware, roleMiddleware("admin"), getPayrollStats);
