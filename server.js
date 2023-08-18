const express = require("express");
const cors = require("cors");
const pool = require("./models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

// signup
app.post("/signup", async (req, res) => {
  const { user_email, user_password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user_password, salt);
  const user_id = uuidv4();
  try {
    const signup = await pool.query(
      "INSERT INTO users(user_id, user_email, user_hashed_password) VALUES($1, $2, $3)",
      [user_id, user_email, hashedPassword]
    );
    const token = jwt.sign({ user_email }, "secret", { expiresIn: "1hr" });
    res.json({ user_id, token });
  } catch (err) {
    console.log(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// login
app.post("/login", async (req, res) => {
  const { user_email, user_password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!users.rows.length) return res.json({ detail: "User does not exist!" });
    const success = await bcrypt.compare(
      user_password,
      users.rows[0].user_hashed_password
    );
    if (success) {
      const user_id = users.rows[0].user_id;
      const token = jwt.sign({ user_id }, "secret", { expiresIn: "1hr" });
      res.json({ id: users.rows[0].user_id, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.json({message : "successfully"});
})

// get events
app.get("/events/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await pool.query(
      "SELECT * FROM events WHERE user_id = $1;",
      [userId]
    );
    res.json(events.rows);
  } catch (err) {
    console.log(err);
  }
});

// get a event

// create a event

// update a event

// delete a event

app.listen(8000, () => {
  console.log(`Server started successfully at PORT ${PORT}`);
});
