const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  checkValidation,
} = require("../middleware/validate");

router.post("/register", validateRegister, checkValidation, registerUser);
router.post("/login", validateLogin, checkValidation, loginUser);

//Privatus maršrutas
router.get("/profile", protect, getProfile);
// Administratoriaus testinis maršrutas
router.get("/admin-test", protect, admin, (req, res) => {
  res.json({
    message: "Administratoriaus prieiga patvirtinta!",
  });
});

module.exports = router;
