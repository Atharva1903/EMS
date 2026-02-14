const router = require("express").Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount   // 👈 ADD THIS
} = require("../controllers/employeeController");



const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createEmployee
);

module.exports = router;
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllEmployees
);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllEmployees);

router.get("/:id", authMiddleware, roleMiddleware("admin"), getEmployeeById);

router.put("/:id", authMiddleware, roleMiddleware("admin"), updateEmployee);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEmployee);
router.get("/stats/count", authMiddleware, roleMiddleware("admin"), getEmployeeCount);
