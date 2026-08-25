
const express = require('express');
const router = express.Router(); 
const skillController = require('../controllers/skillController')

router.get('/skill', skillController.getSkill);



module.exports = router;
