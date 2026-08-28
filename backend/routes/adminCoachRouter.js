const express = require("express");
const router = express.Router();
const adminCoachController = require("../controllers/adminCoachController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireCoach = require("../middlewares/requireCoach");
router.post("/:userId", adminCoachController.updateUserToCoach);
router.get("/", authMiddleware, requireCoach, adminCoachController.getProfile);
router.put(
  "/",
  authMiddleware,
  requireCoach,
  adminCoachController.updateProfile,
);
module.exports = router;
