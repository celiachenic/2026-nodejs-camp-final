const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", packageController.getPackages);
router.post("/", packageController.postPackage);
router.delete("/:creditPackageId", packageController.deletePackage);
router.post(
  "/:creditPackageId",
  authMiddleware,
  packageController.purchasePackage,
);
module.exports = router;
