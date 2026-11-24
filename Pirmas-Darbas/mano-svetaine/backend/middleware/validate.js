const { body, validationResult } = require("express-validator");

// Registracijos duomen7 validacija
const validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Vardas privalomas.")
    .isLength({ max: 50 })
    .withMessage("Vardas negali būti ilgesnis nei 50 simbolių."),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Pavardė privaloma.")
    .isLength({ max: 50 })
    .withMessage("Pavardė negali būti ilgesnė nei 50 simbolių."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Neteisingas el.pašto adresas.")
    .normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage("Slaptažodis turi būti nuo 8 iki 72 simbolių."),
];
// Prisijungimo duomenų validacija
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Neteisingas el. pašto adresas.")
    .normalizeEmail(),

  body("password").isString().notEmpty().withMessage("Slaptažodis privalomas."),
];

// Bendras validacijos rezultatų tikrinimas
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Pateikti netinkami duomenys.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  checkValidation,
};
