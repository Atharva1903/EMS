const router = require("express").Router();
const {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,getLeaveStats
} = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Employee applies leave
router.post("/", authMiddleware, applyLeave);

// Admin views all leaves
router.get("/", authMiddleware, roleMiddleware("admin"), getAllLeaves);

// Admin approves/rejects leave
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateLeaveStatus);

module.exports = router;
router.get("/stats", authMiddleware, roleMiddleware("admin"), getLeaveStats);
