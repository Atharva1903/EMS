const router = require("express").Router();
const {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
  getLeaveStats,
  getMyLeaves
} = require("../controllers/leaveController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Employee routes
router.post("/", authMiddleware, applyLeave);
router.get("/my", authMiddleware, getMyLeaves);

// Admin routes
router.get("/stats", authMiddleware, roleMiddleware("admin"), getLeaveStats);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllLeaves);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateLeaveStatus);

module.exports = router;
