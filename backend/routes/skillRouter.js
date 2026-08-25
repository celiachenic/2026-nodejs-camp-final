
const express = require('express');
const router = express.Router(); 
const skillController = require('../controllers/skillController')

router.get('/skill', skillController.getSkills);
router.post('/skill', skillController.postSkill);
router.delete('/skill/:skillId',skillController.deleteSkill)


module.exports = router;
