const express =require('express')
const router = express.Router();
const publicCoachController = require('../controllers/publicCoachController')

router.get("/",publicCoachController.getCoaches)
router.get("/:coachId",publicCoachController.getCoach)
router.get("/:coachId/courses",publicCoachController.getCoachCourses)
module.exports = router