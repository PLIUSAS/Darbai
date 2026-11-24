require("dotenv").config();

const mongoose = require("mongoose");
const readlineSync = require("readline-sync");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/Users");

const createAdmin = async () => {
  try {
    console.log("\n=== ADMINISTRATORIAUS SUKŪRIMAS ===\n");

    // MongoDB prisijungimas
    await connectDB();
    // Patikriname, ar administratorius jau egzistuoja
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Administratorius jau egzistuoja.");
      return;
    }

    // Surenkame duomenis
    const firstName = readlineSync.question("Vardas: ").trim();
    const lastName = readlineSync.question("Pavarde ").trim();
    const email = readlineSync.question("El.pastas: ").trim().toLowerCase();

    const password = readlineSync.question("Slaptazodis: ", {
      hideEchoBack: true,
    });
    const confirmPassword = readlineSync.question("Pakartokite slaptazodi: ", {
      hideEchoBack: true,
    });

    // Tikriname duomenis
    if (!firstName || !lastName || !email || !password) {
      throw new Error("Visi laukai privalomi.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Neteisingas el.pasto adresas.");
    }
    if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
      throw new Error(
        "Slaptazodis turi buti bent 12 simboliu ir nevirsyti 72 baitu.",
      );
    }
    if (password !== confirmPassword) {
      throw new Error("Slaptazodziai nesutampa.");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(
        "Toks vartotojas jau egzistuoja. Administratorius nebuvo sukurtas.",
      );
    }

    // Užšifruojame slaptažodį
    const hashedPassword = await bcrypt.hash(password, 12);

    // Sukuriame administratorių
    const admin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log("\nAdministratorius sukurtas sekmingai!");
    console.log("ID:", admin._id);
    console.log("El. pastas:", admin.email);
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("\nKlaida:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nMongoDB atsijungta.");
  }
};

createAdmin();
