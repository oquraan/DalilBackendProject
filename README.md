# Expense Tracker — Backend API

A RESTful API built with **Node.js + Express + PostgreSQL** that powers the Expense Tracker application.

---

## Project Structure

```
DalilBackendProject/
├── server.js         # Main Express server & all API routes
├── schema.sql        # Database schema + sample data
├── .env              # Environment variables (not committed)
├── .env.example      # Template for .env
├── package.json
└── imageEndPoint/    # Postman screenshots for all endpoints
```

---

## How to Run the Project from Scratch

### 1. Create the Database (pgAdmin)

1. Open **pgAdmin** and connect to your PostgreSQL server
2. Create a new database (e.g. `expense_tracker`)
3. Open the **Query Tool** on that database
4. Copy the contents of [`schema.sql`](./schema.sql) and run it
5. This will create the `expenses` table and insert sample data

---

### 2. Set Up the `.env` File

Create a `.env` file in the `DalilBackendProject/` folder based on `.env.example`:

```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DB_NAME
PORT=3000
```

> Get the connection info from pgAdmin → right-click your server → Properties → Connection

---

### 3. Install Packages

```
npm install
```

This installs: `express`, `pg`, `cors`, `dotenv`, `nodemon`

> **Why these packages?**
> - `express` — web framework for routing
> - `pg` — connects Node.js to PostgreSQL
> - `cors` — allows the frontend (different port) to send requests to the backend
> - `dotenv` — loads `.env` variables into `process.env`
> - `nodemon` — auto-restarts the server on file changes (dev only)

---

### 4. Run the Server

```bash
nodemon server.js
```

The server will start at: **`http://localhost:3000`**

---

### 5. Open the Frontend

1. Open `DalilFrontProject/index.html` in VS Code
2. Right-click → **Open with Live Server**
3. The frontend will open in the browser (usually `http://127.0.0.1:5500`)

> The frontend talks to the backend at `http://localhost:3000`. Make sure the backend is running first!

---

### Git Workflow Used

Each folder (backend & frontend) has its own GitHub repository. Changes were pushed using branches:

```bash
git checkout -b branch1         # Create & switch to new branch
git add .                       # Stage all files
git commit -m "my commit"       # Commit with message
git push origin branch1         # Push to GitHub
```

---

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/expenses` | Get all expenses |
| `GET` | `/api/expenses?category=Food` | Filter by category |
| `GET` | `/api/expenses?month=09` | Filter by month (01–12) |
| `GET` | `/api/expenses?title=Lunch` | Search by title |
| `GET` | `/api/expenses?orderBy=amount` | Sort by column |
| `GET` | `/api/expenses?category=Food&month=09&orderBy=date` | Combined filters |
| `GET` | `/api/expenses/:id` | Get one expense by ID |
| `POST` | `/api/expenses` | Add new expense |
| `PUT` | `/api/expenses/:id` | Update expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |

**POST / PUT Body:**
```json
{
  "title": "Lunch",
  "amount": 25.00,
  "category": "Food",
  "date": "2026-09-28"
}
```
> Valid categories: `Food` | `Transport` | `Bills` | `Entertainment` | `Other`

---

## Endpoint Screenshots (Postman)

### GET All Expenses
Returns all expenses with numeric and date fields properly formatted.

![GET /api/expenses](./imageEndPoint/GET%20API-expense%20%20with%20solve%20the%20numeric%20and%20date%20problem.jpg)

---

### GET Expense by ID
Returns a single expense by its ID.

![GET /api/expenses/:id](./imageEndPoint/GET%20API-expense-ID%20%20with%20solve%20the%20numeric%20and%20date.jpg)

---

### POST — Add New Expense
Creates a new expense and returns the created record.

![POST /api/expenses](./imageEndPoint/Post-api-expenses.jpg)

---

### PUT — Update Expense (Success)
Updates an existing expense and returns the updated record.

![PUT /api/expenses/:id](./imageEndPoint/PUT-API-expenses-9.jpg)

---

### PUT — Missing Title (400 Bad Request)
Validates required fields before updating.

![PUT missing title](./imageEndPoint/PUT-API-expenses-9-without%20title%20and%20return%20bad%20request%20%20.jpg)

---

### PUT — Invalid Category (400 Bad Request)
Category must be one of the allowed values.

![PUT invalid category](./imageEndPoint/PUT-API-expenses-9%20%20%20check%20if%20%20the%20category%20viloate%20role%20%20in%20data%20base%20%20return%20%20bad%20400.jpg)

---

### PUT — ID Not Found (404 Not Found)
Returns 404 when the expense ID doesn't exist in the database.

![PUT not found](./imageEndPoint/PUT-API-expenses-9%20with%20id%20not%20exist%20in%20data%20base%20%20%20and%20return%20%20404%20notfound%20%20.jpg)

---

### DELETE — Remove Expense
Deletes the expense and returns the deleted record as confirmation.

![DELETE /api/expenses/:id](./imageEndPoint/delete%20%20-api-expenses-9.jpg)

---

## Bonus — Advanced Filtering & Sorting

### Filter by Category
![GET by category](./imageEndPoint/EndPointWithBouns/GET-API-USING%20CATEGORY.jpg)

---

### Filter by Month
![GET by month](./imageEndPoint/EndPointWithBouns/GET-API-USING%20MONTH%20%20.jpg)

---

### Search by Title (Found)
![GET by title](./imageEndPoint/EndPointWithBouns/GET-API-USING%20TITLE.jpg)

---

### Search by Title (Not Found — 404)
![GET title not found](./imageEndPoint/EndPointWithBouns/GET-API-USING%20TITLE%20but%20the%20title%20%20not%20exist%20.jpg%20.jpg)

---

### Filter by Category + Month Combined
![GET category + month](./imageEndPoint/EndPointWithBouns/GET-API-USING%20%20CATEGORY%20%20AND%20MONTH%20%20.jpg%20.jpg)

---

### Sort by Amount
![GET order by amount](./imageEndPoint/EndPointWithBouns/GET-API-USING%20%20ORDER%20BY%20AMOUNT%20%20%20.jpg%20.jpg)

---

### Sort by Date
![GET order by date](./imageEndPoint/EndPointWithBouns/GET-API-USING%20%20ORDER%20BY%20DATE.jpg%20.jpg)

---

### All Filters Combined (Category + Month + Title + OrderBy)
![GET all filters](./imageEndPoint/EndPointWithBouns/GET-API-USING%20ALL%20FILTERS.jpg%20.jpg)

---

## Hardest Challenge & How We Solved It

### Dynamic Filtering, Search & Sorting on One Endpoint

The hardest part was implementing the **bonus features**: filtering by month, searching by title, and sorting by column — all through the **same single `GET` endpoint** without breaking existing behavior.

**The problem:** The frontend sends different combinations of query parameters (e.g. `category + month + orderBy`), and the backend must build a valid SQL query using only what was actually provided — without hardcoding every possible combination.

**How we solved it — Dynamic SQL Query Builder:**

```js
let conditions = [];
let queryParams = [];

if (category) {
  queryParams.push(category);
  conditions.push(`category = $${queryParams.length}`);
}
if (month) {
  queryParams.push(month);
  conditions.push(`TO_CHAR(date, 'MM') = $${queryParams.length}`);
}
if (title) {
  queryParams.push(title);
  conditions.push(`title = $${queryParams.length}`);
}

if (conditions.length > 0) {
  queryText += ` WHERE ` + conditions.join(" AND ");
}

if (allowedColumns.includes(order)) {
  queryText += ` ORDER BY ${order}`;
}
```

We build the `WHERE` clause dynamically by pushing only the active filters into a `conditions` array, then joining them with `AND`. Parameterized queries (`$1`, `$2`...) protect against SQL injection.

We also fixed a bug where not sending `month` caused a `400 Invalid month` error because `req.query.month` returned `undefined` instead of `""`:

```js
// Before (bug)
let month = req.query.month;       // undefined → fails validation

// After (fix)
let month = req.query.month || ""; // "" → passes validation
```

---

