const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM courses");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { title, description, imageUrl } = req.body;
  const [result] = await pool.query(
    "INSERT INTO courses (title, description, imageUrl, enrolledCount) VALUES (?, ?, ?, 0)",
    [title, description, imageUrl]
  );
  res.json({
    id: result.insertId,
    title,
    description,
    imageUrl,
    enrolledCount: 0,
  });
});

module.exports = router;
