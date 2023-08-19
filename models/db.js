require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  // user: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD + "",
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // database: process.env.DB_NAME,
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

if (pool) {
  console.log("Database connection established");
}

module.exports = pool;
