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

// api working testing
app.get("/", (req, res) => {
  res.json({ message: "Api is running successfully" });
});

// get all users
app.get("/users", async (req, res) => {
  try {
    const events = await pool.query("SELECT * FROM users");
    res.json(events.rows);
  } catch (err) {
    console.log(err);
  }
});

// get users details
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await pool.query(
      "SELECT user_email FROM users WHERE user_id = $1",
      [userId]
    );
    res.json(events.rows);
  } catch (err) {
    console.log(err);
  }
});

// signup a user
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
    const token = jwt.sign({ user_id }, "secret", { expiresIn: "1hr" });
    res.json({ user_id, token });
  } catch (err) {
    console.log(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// login a user
app.post("/login", async (req, res) => {
  const { user_email, user_password } = req.body;
  try {
    const users = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );
    if (!users.rows.length) return res.json({ detail: "User does not exist!" });
    const success = await bcrypt.compare(
      user_password,
      users.rows[0].user_hashed_password
    );
    if (success) {
      const user_id = users.rows[0].user_id;
      const token = jwt.sign({ user_id }, "secret", { expiresIn: "1hr" });
      res.json({ user_id, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.log(err);
  }
});

// get all events
app.get("/events", async (req, res) => {
  try {
    const events = await pool.query("SELECT * FROM events");
    res.json(events.rows);
  } catch (err) {
    console.log(err);
  }
});

// get user created events
app.get("/events/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await pool.query(
      "SELECT ev.event_name, ap.sponsor_name, ap.sponsor_phone, ap.application_status, us.user_email FROM events ev INNER JOIN applications ap using(event_id) INNER JOIN users us ON us.user_id = ap.sponsor_id WHERE ev.user_id = $1;",
      [userId]
    );
    res.json(events.rows);
  } catch (err) {
    console.log(err);
  }
});

// create a event
app.post("/events", async (req, res) => {
  const {
    user_id,
    event_name,
    event_type,
    event_date,
    event_footfall,
    sponsorship_amount,
    deliverables,
  } = req.body;
  console.log(
    user_id,
    event_name,
    event_type,
    event_date,
    event_footfall,
    sponsorship_amount,
    deliverables
  );
  const event_id = uuidv4();

  try {
    const newEvent = await pool.query(
      "INSERT INTO events(event_id, user_id, event_name, event_type, event_date, event_footfall, sponsorship_amount, deliverables) VALUES($1, $2, $3, $4, $5, $6, $7, $8);",
      [
        event_id,
        user_id,
        event_name,
        event_type,
        event_date,
        event_footfall,
        sponsorship_amount,
        deliverables,
      ]
    );
    res.json(newEvent);
  } catch (err) {
    console.log(err);
  }
});

// delete a event
app.delete("/events/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const deleteEvent = await pool.query(
      "DELETE FROM events WHERE event_id = $1",
      [eventId]
    );
    res.json(deleteEvent);
  } catch (err) {
    console.log(err);
  }
});

// get all applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await pool.query("SELECT * FROM applications");
    res.json(applications.rows);
  } catch (err) {
    console.log(err);
  }
});

// get users all applications
app.get("/applications/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const applications = await pool.query(
      "SELECT event_name, event_date, application_status FROM events INNER JOIN applications using(event_id) WHERE sponsor_id = $1",
      [userId]
    );
    res.json(applications.rows);
  } catch (err) {
    console.log(err);
  }
});

// apply for a event
app.post("/applications", async (req, res) => {
  const {
    sponsor_id,
    event_id,
    sponsor_name,
    sponsor_phone,
    application_status,
  } = req.body;
  console.log(
    sponsor_id,
    event_id,
    sponsor_name,
    sponsor_phone,
    application_status
  );
  const application_id = uuidv4();

  try {
    const newApplication = await pool.query(
      "INSERT INTO applications(application_id, sponsor_id, event_id, sponsor_name, sponsor_phone, application_status) VALUES($1, $2, $3, $4, $5, $6);",
      [
        application_id,
        sponsor_id,
        event_id,
        sponsor_name,
        sponsor_phone,
        application_status,
      ]
    );
    res.json(newApplication);
  } catch (err) {
    console.log(err);
  }
});

// delete application
app.delete("/applications/:applicationId", async (req, res) => {
  const { applicationId } = req.params;
  try {
    const deleteApplication = await pool.query(
      "DELETE FROM applications WHERE application_id = $1",
      [applicationId]
    );
    res.json(deleteApplication);
  } catch (err) {
    console.log(err);
  }
});

app.listen(8000, () => {
  console.log(`Server started successfully at PORT ${PORT}`);
});
