const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const { userId, categoryId } = req.query;
  let query = "SELECT * FROM scores";
  const params = [];

  if (userId || categoryId) {
    query += " WHERE";
    if (userId) {
      query += " userId=?";
      params.push(userId);
    }
    if (categoryId) {
      query += userId ? " AND categoryId=?" : " categoryId=?";
      params.push(categoryId);
    }
  }

  query += " ORDER BY date DESC";
  const [rows] = await pool.query(query, params);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { userId, userName, categoryId, score, date, feedback } = req.body;
  const [result] = await pool.query(
    "INSERT INTO scores (userId, userName, categoryId, score, date, feedback) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, userName, categoryId, score, date, feedback]
  );
  res.json({ id: result.insertId, ...req.body });
});

router.get("/average/:userId", async (req, res) => {
  const [result] = await pool.query(
    "SELECT AVG(score) as average FROM scores WHERE userId=?",
    [req.params.userId]
  );
  res.json({ average: Math.round(result[0].average || 0) });
});

router.get("/category-stats", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT c.id, c.name, 
      COUNT(s.id) as count,
      AVG(s.score) as average,
      MIN(s.score) as min,
      MAX(s.score) as max
    FROM categories c
    LEFT JOIN scores s ON c.id = s.categoryId
    GROUP BY c.id, c.name
  `);
  res.json(rows);
});

module.exports = router;
