const express =require('express')
const router = express.Router();
const publicCourseController = require('../controllers/publicCourseController');
router.get("/",publicCourseController.getCourses)
module.exports = router