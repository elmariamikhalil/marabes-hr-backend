const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM time_off_requests");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { userId, userName, type, startDate, endDate, reason } = req.body;
  const [result] = await pool.query(
    'INSERT INTO time_off_requests (userId, userName, type, startDate, endDate, reason, status) VALUES (?, ?, ?, ?, ?, ?, "PENDING")',
    [userId, userName, type, startDate, endDate, reason]
  );
  res.json({ id: result.insertId, ...req.body, status: "PENDING" });
});

router.put("/:id", async (req, res) => {
  const { status, note } = req.body;
  await pool.query(
    "UPDATE time_off_requests SET status=?, adminNote=? WHERE id=?",
    [status, note, req.params.id]
  );
  res.json({ success: true });
});

module.exports = router;
