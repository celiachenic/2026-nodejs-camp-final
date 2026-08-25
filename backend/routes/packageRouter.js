const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

router.get("/", packageController.getPackages);
router.post("/", packageController.postPackage);
router.delete("/:creditPackageId", packageController.deletePackage);

module.exports = router;
