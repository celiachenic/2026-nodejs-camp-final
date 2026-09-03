const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put("/password", authMiddleware, userController.updatePassword);
router.get('/credit-package',authMiddleware,userController.getCreditPackages)
module.exports = router;
