const router = require("express").Router();
const {
  markToday,
  getMyAttendance,
  getAllAttendance
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/mark", authMiddleware, roleMiddleware("employee"), markToday);

router.get("/my", authMiddleware, roleMiddleware("employee"), getMyAttendance);

router.get("/", authMiddleware, roleMiddleware("admin"), getAllAttendance);

module.exports = router;

