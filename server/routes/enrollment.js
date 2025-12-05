const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:userId", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM enrollments WHERE userId=?", [
    req.params.userId,
  ]);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { userId, courseId } = req.body;
  const [result] = await pool.query(
    "INSERT INTO enrollments (userId, courseId, dateEnrolled) VALUES (?, ?, CURDATE())",
    [userId, courseId]
  );
  await pool.query(
    "UPDATE courses SET enrolledCount = enrolledCount + 1 WHERE id=?",
    [courseId]
  );
  res.json({
    id: result.insertId,
    userId,
    courseId,
    dateEnrolled: new Date().toISOString(),
  });
});

module.exports = router;
