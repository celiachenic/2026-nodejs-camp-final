const express = require("express");
const router = express.Router();
const adminCoachController = require("../controllers/adminCoachController");

router.post("/:userId", adminCoachController.updateUserToCoach);

module.exports = router;
