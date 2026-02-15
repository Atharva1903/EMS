const router = require("express").Router();
const {
  getDepartments,
  createDepartment,
  deleteDepartment
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getDepartments
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteDepartment
);

module.exports = router;

