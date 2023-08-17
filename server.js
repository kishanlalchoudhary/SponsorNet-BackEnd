const express = require("express");
const cors = require("cors");
const pool = require("./models/db");

const PORT = process.env.PORT || 8000;
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log(`Server started successfully at PORT ${PORT}`);
});
