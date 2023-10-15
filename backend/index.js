const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
const Report = require("./reportModel");

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));
const server = app.listen(process.env.PORT);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
};
connectDB();
console.log(`Connected to port ${process.env.PORT}`);

const entries = [];

app.post("/add", async (req, res) => {
  const newEntry = req.body;
  try {
    const report = new Report(newEntry);
    await report.save();
    console.log("New report saved:", newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save the report" });
  }
});

app.get("/entries", async (req, res, next) => {
  try {
    const entries = await Report.find({});
    console.log(entries);
    res.status(200).json(entries);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
