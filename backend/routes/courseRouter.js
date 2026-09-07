const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const courseController = require("../controllers/courseController");
router.get("/", courseController.getCourses);
router.post("/:courseId", authMiddleware, courseController.bookCourse);
module.exports = router;
