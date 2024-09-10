const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "website",
  password: "mauriciU2@",
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const query = "SELECT * FROM details ORDER BY id DESC LIMIT 1"; // Get the latest entry
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows[0];
    res.render("index", { data });
  });
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
    res.redirect("/"); // Redirect to the home page to display the new data
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
