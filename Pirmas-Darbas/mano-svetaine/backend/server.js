require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRouter = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
// MongoDB prijungimas
connectDB();

app.get("/", (req, res) => {
  res.send("Mano e-parduotuvės backend veikia!");
});
// Vartotojų autentifikacijos maršrutai
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveris paleistas: http://localhost:${PORT}`);
});
