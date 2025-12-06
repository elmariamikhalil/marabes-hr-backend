const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:userId", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM notifications WHERE userId=? OR userId IS NULL ORDER BY createdAt DESC LIMIT 20",
    [req.params.userId]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { userId, message, type } = req.body;
  const [result] = await pool.query(
    "INSERT INTO notifications (userId, message, type, isRead, createdAt) VALUES (?, ?, ?, 0, NOW())",
    [userId, message, type]
  );
  res.json({ id: result.insertId });
});

router.put("/:id/read", async (req, res) => {
  await pool.query("UPDATE notifications SET isRead=1 WHERE id=?", [
    req.params.id,
  ]);
  res.json({ success: true });
});

module.exports = router;
