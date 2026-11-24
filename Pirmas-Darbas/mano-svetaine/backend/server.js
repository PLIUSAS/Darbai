require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");

const app = express();
// HTTP saugumas
app.use(helmet());

// API užklausų ribojimas
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Per daug užklausų. Bandykite vėliau.",
  },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Per daug prisijungimo bandymų. Bandykite vėliau.",
  },
});

app.use(cors());
app.use(express.json({ limit: "10kb" }));
// MongoDB prijungimas
connectDB();

app.get("/", (req, res) => {
  res.send("Mano e-parduotuvės backend veikia!");
});

// API užklausų ribojimas
app.use("/api", apiLimiter);
// Vartotojų autentifikacijos maršrutai
app.use("/api/auth", authLimiter, authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveris paleistas: http://localhost:${PORT}`);
});
