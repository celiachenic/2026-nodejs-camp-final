const express = require("express");
const router = express.Router();
const coachController = require("../controllers/coachController");

router.get("/", coachController.getCoaches);
router.get("/:coachId", coachController.getCoach);
router.get("/:coachId/courses", coachController.getCoachCourses);
module.exports = router;
