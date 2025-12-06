const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM categories");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const [result] = await pool.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name]
  );
  res.json({ id: result.insertId, name });
});

module.exports = router;
