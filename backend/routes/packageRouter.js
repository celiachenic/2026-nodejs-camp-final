const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

router.get("/", packageController.getPackage);
router.post("/", packageController.postPackage);
// router.delete('/skill/{skillId}', (req, res) => {

// });

module.exports = router;
