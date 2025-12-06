const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // For demo, accept any password OR check hashed password
    // const validPassword = await bcrypt.compare(password, user.password);
    // if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    delete user.password;
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      jobPosition,
      birthday,
      dateHired,
      phone,
      address,
      department,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, avatarUrl, jobPosition, birthday, dateHired, phone, address, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        hashedPassword,
        role || "EMPLOYEE",
        `https://picsum.photos/200?random=${Date.now()}`,
        jobPosition,
        birthday,
        dateHired,
        phone,
        address,
        department,
      ]
    );

    res.json({ id: result.insertId, message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
