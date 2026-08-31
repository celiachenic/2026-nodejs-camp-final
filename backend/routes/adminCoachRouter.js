const express = require("express");
const router = express.Router();
const adminCoachController = require("../controllers/adminCoachController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireCoach = require("../middlewares/requireCoach");
router.post(
  "/courses",
  authMiddleware,
  requireCoach,
  adminCoachController.openCourse,
);
router.post("/:userId", adminCoachController.updateUserToCoach);
router.get("/", authMiddleware, requireCoach, adminCoachController.getProfile);
router.put(
  "/",
  authMiddleware,
  requireCoach,
  adminCoachController.updateProfile,
);
router.get(
  "/courses",
  authMiddleware,
  requireCoach,
  adminCoachController.getCoachCourses,
);

router.get(
  "/courses/:courseId",
  authMiddleware,
  adminCoachController.getCoachCourse,
);

router.put(
  "/courses/:courseId",
  authMiddleware,
  adminCoachController.updateCoachCourse,
);

module.exports = router;
