const router = require("express").Router();
const {
  markToday,
  getMyAttendance,
  getAllAttendance,
  getAttendanceStats
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, markToday);
router.get("/my", authMiddleware, getMyAttendance);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllAttendance);
router.get("/stats", authMiddleware, roleMiddleware("admin"), getAttendanceStats); // Add this

module.exports = router;
