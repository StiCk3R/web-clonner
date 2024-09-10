const express = require("express"); // Framework for Node.js
const bodyParser = require("body-parser"); // Middleware for parsing request bodies
const { Pool } = require("pg"); // PostgreSQL client for Node.js
const path = require("path"); // Utility for working with file and directory paths

const app = express(); // Express application
const port = 3000; // Port number where the server will listen for requests

const pool = new Pool({
  user: "postgres", // Username for the database
  host: "localhost", // Host for the database
  database: "website", // Database name
  password: "mauriciU2@", // Password for the database
  port: 5432, // Port for the database
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", (req, res) => {
  const { title, subtitle, paragraph, link } = req.body;

  const query =
    "INSERT INTO details (title, subtitle, paragraph, link) VALUES ($1, $2, $3, $4)";
  const values = [title, subtitle, paragraph, link];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    res.redirect("/display");
  });
});

app.get("/display", (req, res) => {
  const query = "SELECT * FROM details ORDER BY id DESC LIMIT 1"; // Get the latest entry
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows[0] || {};
    res.render("display", { data });
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
