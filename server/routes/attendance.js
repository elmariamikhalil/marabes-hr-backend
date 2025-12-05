const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:userId/today", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance WHERE userId=? AND date=CURDATE()",
    [req.params.userId]
  );
  res.json(rows[0] || null);
});

router.post("/:userId/clockin", async (req, res) => {
  const [result] = await pool.query(
    'INSERT INTO attendance (userId, date, clockInTime, status) VALUES (?, CURDATE(), NOW(), "CLOCKED_IN")',
    [req.params.userId]
  );
  res.json({
    id: result.insertId,
    userId: req.params.userId,
    status: "CLOCKED_IN",
  });
});

router.post("/:userId/clockout", async (req, res) => {
  await pool.query(
    'UPDATE attendance SET clockOutTime=NOW(), status="CLOCKED_OUT" WHERE userId=? AND date=CURDATE()',
    [req.params.userId]
  );
  res.json({ success: true });
});

module.exports = router;
