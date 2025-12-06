const express = require("express");
const router = express.Router();
const pool = require("../db");
const createNotification = async (userId, message, type = "info") => {
  await pool.query(
    "INSERT INTO notifications (userId, message, type, isRead, createdAt) VALUES (?, ?, ?, 0, NOW())",
    [userId, message, type]
  );
};
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

  // Get course name for notification
  const [courses] = await pool.query("SELECT title FROM courses WHERE id=?", [
    courseId,
  ]);
  if (courses.length > 0) {
    await createNotification(
      userId,
      `You have successfully enrolled in ${courses[0].title}`,
      "success"
    );
  }

  res.json({
    id: result.insertId,
    userId,
    courseId,
    dateEnrolled: new Date().toISOString(),
  });
});

module.exports = router;
