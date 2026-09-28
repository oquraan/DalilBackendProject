const express = require("express");

var cors = require("cors");

const app = express();
require("dotenv").config();

const { Pool } = require("pg");
app.use(express.json());
app.use(cors());
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;
app.get("/api/hello", (req, res) => {
  res.json({ message: "Welcom Dalil " });
});

app.get("/api/expenses", async (req, res) => {
  let category = req.query.category || "";
  let order = req.query.orderBy || "";
  let month = req.query.month || "";
  let title = req.query.title || "";

  const validMonths = [
    "",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  if (!validMonths.includes(month)) {
    return res
      .status(400)
      .json({ message: "Invalid month format. Please use '01' to '12'." });
  }
  console.log(
    "1.ca :" + category + "   " + "2.order " + order + "  3. Month :  " + month,
  );

  try {
    let queryText;

    queryText = `select  id, 
        title, 
        category, 
        amount::float8, 
        to_char(date, 'YYYY-MM-DD') as date from expenses   `;
    let queryParams = [];
    let conditions = [];
    if (category && category !== "") {
      queryParams.push(category);
      conditions.push(`category = $${queryParams.length}`);
    }

    if (month && month !== "") {
      queryParams.push(month);
      conditions.push(`TO_CHAR(date, 'MM') = $${queryParams.length}`);
    }
    if (title && title !== "") {
      queryParams.push(title);
      conditions.push(`title = $${queryParams.length}`);
    }
    if (conditions.length > 0) {
      queryText += ` WHERE ` + conditions.join(" AND ");
    }
    const allowedColumns = ["id", "title", "amount", "category", "date"];
    if (order && allowedColumns.includes(order)) {
      queryText += ` ORDER BY ${order} `;
      console.log(` ORDER BY ${order} `);
    } else {
      console.log(` ORDER BY id DESC `);
      queryText += ` ORDER BY id DESC `;
    }

    const allExpenses = await pool.query(queryText, queryParams);
    if (allExpenses.rows.length == 0)
      return res.status(404).json({
        message: "dont have  any expenses",
        month: month,
        order: order,
        category: category,
      });
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

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
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
  // .then(() => {
  //   app.listen(port, () => {
  //     console.log(`app listening on port http://localhost:${port}`);
  //   });
  // })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });
