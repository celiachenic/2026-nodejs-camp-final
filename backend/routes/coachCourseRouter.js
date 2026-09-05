const express = require("express");
const router = express.Router();
const coachCourseController = require("../controllers/coachCourseController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireCoach = require("../middlewares/requireCoach");
router.post(
  "/courses",
  authMiddleware,
  requireCoach,
  coachCourseController.openCourse,
);
router.post("/:userId", coachCourseController.updateUserToCoach);
router.get("/", authMiddleware, requireCoach, coachCourseController.getProfile);
router.put(
  "/",
  authMiddleware,
  requireCoach,
  coachCourseController.updateProfile,
);
router.get(
  "/courses",
  authMiddleware,
  requireCoach,
  coachCourseController.getCoachCourses,
);

router.get(
  "/courses/:courseId",
  authMiddleware,
  coachCourseController.getCoachCourse,
);

router.put(
  "/courses/:courseId",
  authMiddleware,
  coachCourseController.updateCoachCourse,
);

module.exports = router;
