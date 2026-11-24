const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Patikriname, ar pateiktas Beearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Prieiga negalima. Pateikite tokeną.",
      });
    }
    const token = authHeader.split(" ")[1];

    // Patikriname tokeno galiojima
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Tokenas negaliojantis arba pasibaigęs.",
      });
    }

    // Gauname vartotoją iš MongoDB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Vartotojas nerastas.",
      });
    }
    // Priskiriame vartotojo informaciją užklausai
    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Autentifikacijos klaida:", error);

    return res.status(500).json({
      message: "Serverio klaida tikrinant vartotoją.",
    });
  }
};
// Administratoriaus autorizacija
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Neturite administratoriaus teisių",
    });
  }
  next();
};

module.exports = { protect, admin };
