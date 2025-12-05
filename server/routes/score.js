const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM scores");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { userId, userName, categoryId, score, date } = req.body;
  const [result] = await pool.query(
    "INSERT INTO scores (userId, userName, categoryId, score, date) VALUES (?, ?, ?, ?, ?)",
    [userId, userName, categoryId, score, date]
  );
  res.json({ id: result.insertId, ...req.body });
});

module.exports = router;
