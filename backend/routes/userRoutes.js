const express = require("express");
const router = express.Router();

const { updateUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateUser
);

module.exports = router;
