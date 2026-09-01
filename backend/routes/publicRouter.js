const express =require('express')
const router = express.Router();
const publicCoachController = require('../controllers/publicCoachController')
const publicCourseController = require('../controllers/publicCourseController');

router.get("/",publicCoachController.getCoaches)
router.get("/:coachId",publicCoachController.getCoach)
//router.get("/:coachId/courses",publicCoachController.getCoachCourses)
//router.get("/courses",publicCourseController.getCourses)
module.exports = router