const router = require("express").Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
  getEmployeeProfile,     // 👈 ADD THIS
  updateEmployeeProfile   // 👈 ADD THIS
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ============ PROFILE ROUTES (Any Logged In Employee) ============
router.get("/profile", authMiddleware, getEmployeeProfile);
router.put("/profile", authMiddleware, updateEmployeeProfile);


// ============ ADMIN ROUTES ============
router.get("/stats/count", authMiddleware, roleMiddleware("admin"), getEmployeeCount);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createEmployee
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllEmployees
);

router.get("/:id", authMiddleware, roleMiddleware("admin"), getEmployeeById);

router.put("/:id", authMiddleware, roleMiddleware("admin"), updateEmployee);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEmployee);

module.exports = router;
