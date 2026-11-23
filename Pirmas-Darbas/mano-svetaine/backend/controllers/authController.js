const User = require("../models/Users");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Patikriname
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Užpildykite visus laukus.",
      });
    }
    // Patikrinimas slaptažodžio
    if (password.length < 8) {
      return res.status(400).json({
        message: "Slaptažodis turi būti bent 8 simbolių.",
      });
    }
    // Patikriname, ar el.paštas registruotas
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Šis el.paštas jau registruotas.",
      });
    }

    // Užšifruojame slaptažodį
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sukuriame naują vartotoją
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Gra=iname atsakyma klientui

    res.status(201).json({
      message: "Registracija sėkminga!",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Šis el.paštas jau registruotas.",
      });
    }
    console.error("Registracijos klaida:", error);
    res.status(500).json({
      message: "Serverio klaida registracijos metu.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Įveskite el.pašta ir slaptažodį.",
      });
    }
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user) {
      return res.status(401).json({
        message: "Neteisingas el.pa6tas ar slaptažodis.",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Neteisingas el.pa6tas arba slaptažodis.",
      });
    }
    const token = require("jsonwebtoken").sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.status(200).json({
      message: "Prisijungimas sėkmingas!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Prisijungimo klaida:", error);
    res.status(500).json({
      message: "Serverio klaida prisijungimo metu.",
    });
  }
};

module.exports = { registerUser, loginUser };
