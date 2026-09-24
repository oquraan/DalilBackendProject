const express = require("express");

var cors = require("cors");

const app = express();
const { Pool } = require("pg");
app.use(express.json());
app.use(cors());
require("dotenv").config();
app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcom Dalil " });
});

// app.get("/api/expenses", (req, res) => {
//   res.json({
//     id: 1,
//     title: "Lunch",
//     amount: 4.5,
//     category: "Food",
//     date: "2026-01-15",
//   });
// });

app.get("/api/expenses", async (req, res) => {
  try {
    let allExpenses = await pool.query(`select  id, 
        title, 
        category, 
        amount::float8, 
        to_char(date, 'YYYY-MM-DD') as date from expenses  `);
    if (allExpenses.rows.length == 0)
      return res.status(404).json({ message: "dont have  any expenses" });
    res.json(allExpenses.rows);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id))
    return res.status(404).json({ message: "id should be a number  " });

  try {
    let allExpenses = await pool.query(
      `
    select id, 
        title, 
        category, 
        amount::float8, 
        to_char(date, 'YYYY-MM-DD') as date from expenses where  id=$1 `,
      [id],
    );
    if (allExpenses.rows.length == 0)
      return res
        .status(404)
        .json({ message: "dont have any record in this id " });

    res.json(allExpenses.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/api/expenses", async (req, res) => {
  // {
  // "id": 1,
  // "title": "Lunch",
  // "amount": 4.5,
  // "category": "Food",
  // "date": "2026-01-15"
  // }

  const { title, amount, category, date } = req.body;
  if (!title)
    return res.status(400).json({ message: "Title field is required" });

  if (!amount)
    return res.status(400).json({ message: "Amount field is required" });
  else if (amount <= 0)
    return res
      .status(400)
      .json({ message: "Amount field must be greater than zero  " });

  const allowedCategories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other",
  ];
  if (!category)
    return res.status(400).json({ message: "category field is required" });
  else if (!allowedCategories.includes(category))
    return res.status(400).json({
      message:
        "Category must be one of these category   :Food, Transport, Bills, Entertainment, Other ",
    });

  if (!date) return res.status(400).json({ message: "date field is required" });

  try {
    const newExpense = await pool.query(
      `INSERT INTO  expenses (title,amount,category,date) values($1,$2,$3,$4) RETURNING *`,
      [title, amount, category, date],
    );
    console.log("added sucssfuly ");
    res.status(201).json(newExpense.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  // {
  // "id": 1,
  // "title": "Lunch",
  // "amount": 4.5,
  // "category": "Food",
  // "date": "2026-01-15"
  // }
  const { id } = req.params;
  const { title, amount, category, date } = req.body;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must   be  a number  " });
  if (!title)
    return res.status(400).json({ message: "Title field is required" });

  if (!amount)
    return res.status(400).json({ message: "Amount field is required" });
  else if (amount <= 0)
    return res
      .status(400)
      .json({ message: "Amount field must be greater than zero  " });

  const allowedCategories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other",
  ];
  if (!category)
    return res.status(400).json({ message: "category field is required" });
  else if (!allowedCategories.includes(category))
    return res.status(400).json({
      message:
        "Category must be one of these category   :Food, Transport, Bills, Entertainment, Other ",
    });

  if (!date) return res.status(400).json({ message: "date field is required" });

  try {
    const newExpense = await pool.query(
      `Update    expenses  set title=$1, amount=$2 ,category=$3, date=$4 where id=$5 RETURNING *`,
      [title, amount, category, date, id],
    );
    if (newExpense.rows.length === 0)
      return res.status(404).json({ message: "The Expense not found   " });
    console.log("updated  sucssfuly ");
    res.json(newExpense.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must   be  a number  " });

  try {
    const newExpense = await pool.query(
      `delete from expenses where id=$1 RETURNING *`,
      [id],
    );
    if (newExpense.rows.length === 0)
      return res.status(404).json({ message: "The Expense not found   " });
    console.log("ID ${id} deleted successfully ");
    res.json({
      message: "Deleted Successfully",
      deletedExpense: newExpense.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// app.get("/api/getAllExpenses", async (req, res) => {
//   try {
//     let allExpenses = await pool.query(`
//     select * from expenses  `);
//     if (allExpenses.rows.length == 0)
//       return res.status(404).json({ message: "dont have  any expenses" });
//     res.json(allExpenses.rows);
//   } catch (error) {}
// });

// app.get("/api/getAllExpenses/:id", async (req, res) => {
//   const { id } = req.params;

//   if (isNaN(id))
//     return res.status(404).json({ message: "id should be a number  " });

//   try {
//     let allExpenses = await pool.query(
//       `
//     select * from expenses where  id=$1 `,
//       [id],
//     );
//     if (allExpenses.rows.length == 0)
//       return res
//         .status(404)
//         .json({ message: "dont have any record in this id " });

//     res.json(allExpenses.rows);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`app listening on port http://localhost:${port}`);
// });

pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();

        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;
        console.log(" Connected to DB:", res.rows[0]);

        console.log(
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`,
        );

        console.log(`App listening on port http://localhost:${port}`);
      });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });

// Expense Tracker - backend (Express API + PostgreSQL)
//
// PHASE 1
// Setup:
//   1. Create a database named expense_tracker and run schema.sql on it.
//   2. Copy .env.example to a new file named .env and write your PostgreSQL password.
//   3. npm install express cors pg dotenv
// Run:    node server.js   (restart it every time you change this file)
//
// Endpoints you need to build:
//   GET    /api/expenses        return all expenses
//   GET    /api/expenses/:id    return one expense (404 if not found)
//   POST   /api/expenses        add an expense (201, or 400 if the data is invalid)
//   PUT    /api/expenses/:id    update an expense (200, 400, or 404)
//   DELETE /api/expenses/:id    delete an expense (200, or 404)
//
// Tips:
//   - Create one Pool (from the "pg" library) with the values from .env,
//     and use pool.query(...) in every route.
//   - ALWAYS send the values as parameters: pool.query("... WHERE id = $1", [id]).
//     NEVER build the SQL text by joining strings with data from the user.
//   - Use RETURNING to get the new (or updated) row back from INSERT and UPDATE.
//   - The database creates the id. The client never sends one.
//   - pg returns NUMERIC as text and DATE as a JavaScript Date, so fix both in your SELECT.
//     Hint: amount::float8 and to_char(date, 'YYYY-MM-DD').
//   - Validate the data before the query, and answer 400 with a message that explains the problem.
//   - Check the id before the query. A text like "abc" makes PostgreSQL throw an error.
//   - Enable CORS so the frontend can talk to the server.
//   - Test every endpoint with Thunder Client BEFORE you connect the frontend.
