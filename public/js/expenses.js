// const API_URL = "http://localhost:3000/api/expenses";
const API_URL = "https://omaressamquraan.com/api/expenses";
let isLoding = true;
let isLight = true;

import { ChartExpense } from "./chart.js";
function Theme() {
  const isDark = !isLight;

  const LIGHT = { bg: "#ffffff", text: "#212529" };
  const DARK = { bg: "#1a1a2e", text: "#e0e0e0" };
  const c = isDark ? LIGHT : DARK;

  document.body.style.backgroundColor = c.bg;

  const navbar = document.querySelector("nav");
  if (navbar) navbar.style.backgroundColor = c.bg;

  document
    .querySelectorAll("#cards .col-12, #cards .col-md")
    .forEach((card) => {
      card.style.backgroundColor = c.bg;
    });

  const mainContainer = document.querySelector(".container.mt-5.p-4");
  if (mainContainer) {
    mainContainer.style.backgroundColor = c.bg;
    mainContainer.style.borderColor = c.text;
  }

  const form = document.querySelector("form.container");
  if (form) {
    form.style.backgroundColor = c.bg;
    form.style.borderColor = c.text;
  }

  document.querySelectorAll("input, select").forEach((el) => {
    el.style.backgroundColor = c.bg;
    el.style.color = c.text;
    el.style.borderColor = c.text;
  });

  document.querySelectorAll("#tableBody tr").forEach((tr) => {
    tr.style.backgroundColor = isDark ? "" : c.bg;
    tr.style.borderColor = isDark ? "" : c.text;
  });

  const modal = document.getElementById("updateBox");
  if (modal) {
    modal.style.backgroundColor = c.bg;
    modal.style.color = c.text;
    modal.style.borderColor = c.text;
  }

  const btn = document.querySelector(".theme");
  if (btn) btn.textContent = isDark ? " Light" : " Dark";

  isLight = !isLight;
}

function Spinner() {
  return `<div class="d-flex justify-content-center my-4 align-items-center ">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  `;
}
async function getAllExpenses(
  selectedCategory = "",
  orderBy = "",
  month = "",
  title = "",
) {
  let totalExpenses = 0;
  let numberOfExpenses;
  let highestExpenses = 0;
  let divCards = document.getElementById("cards");
  divCards.innerHTML = Spinner();
  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = ``;

  try {
    const response = await fetch(
      API_URL +
        `?category=${selectedCategory}&orderBy=${orderBy}&month=${month}&title=${title}`,
    );

    const data = await response.json();

    if (response.status === 404) {
      let tableHeader = document.getElementById("tableHeader");
      tableHeader.innerHTML = `
    <tr>
      <th data-order="title" style="cursor: pointer;" class="text-primary">Title ↕</th>
      <th data-order="amount" style="cursor: pointer;" class="text-primary">Amount ↕</th>
      <th data-order="category" style="cursor: pointer;" class="text-primary">Category ↕</th>
      <th data-order="date" style="cursor: pointer;" class="text-primary">Date ↕</th>
      <th>Actions</th>
    </tr>
  `;
      tableBody.innerHTML = `    <tr>
      <td colspan="5" class="text-center text-danger p-4 fw-bold">
        ${data.message} <br>
        <span class="text-muted fw-normal small">Category: ${data.category} | Month: ${data.month}</span>
      </td>
    </tr>`;
      document.getElementById("cards").innerHTML = "";
      return;
    }

    data.map((element) => {
      totalExpenses += element.amount;

      if (element.amount > highestExpenses) highestExpenses = element.amount;
    });
    numberOfExpenses = data.length;
    SummaryCard(totalExpenses, highestExpenses, numberOfExpenses);
    ShowDataForm(data);
    ChartExpense(data);
    isLoding = false;
  } catch (error) {
    alert(
      "We are experiencing some technical issues. We will fix this soon! Please try again later.",
    );
  }
}
let categoryFilterValue;
let monthFilterValue;
let monthFilter = document.getElementById("monthFilter");
monthFilterValue = monthFilter.value;

function Filteration() {
  let categoryFilter = document.getElementById("categoryFilter");
  categoryFilterValue = categoryFilter.value;
  categoryFilter.addEventListener("change", (e) => {
    categoryFilterValue = e.target.value;
    getAllExpenses(categoryFilterValue, "", monthFilterValue);
  });

  monthFilter.addEventListener("change", (e) => {
    monthFilterValue = e.target.value;
    getAllExpenses(categoryFilterValue, "", monthFilterValue);
  });
  let titleInput = document.getElementById("TitleForm");
  let typingTimer;

  titleInput.addEventListener("input", (e) => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      getAllExpenses(categoryFilterValue, "", monthFilterValue, e.target.value);
    }, 500);
  });
}
Filteration();
getAllExpenses("", "", "");

function NavBar() {
  let header = document.querySelector("header");
  header.innerHTML = `<nav class="navbar bg-black px-3 d-flex justify-content-between align-items-center">
  <a class="navbar-brand text-light fw-bold fs-5 mb-0" href="#">
  Expense Tracker
  </a>
  <button class="theme btn btn-outline-light btn-sm">
   Dark
  </button>
</nav>`;
}
NavBar();

let buttonTheme = document.getElementsByClassName("theme")[0];

buttonTheme.addEventListener("click", () => Theme());

function SummaryCard(total, max, count) {
  let divCards = document.getElementById("cards");
  divCards.innerHTML = "";
  let containerCard = document.createElement("div");
  containerCard.innerHTML = "";
  containerCard.className = "container mt-5";
  let row = document.createElement("div");
  row.className = "row gap-2";
  let totalExpensesCard = document.createElement("div");
  let numberOfExpensesCard = document.createElement("div");
  let highestExpensesCard = document.createElement("div");

  let classna =
    "col-12 col-md m-2 d-flex flex-column justify-content-center align-items-center bg-white text-dark text-center rounded shadow-sm p-3";

  totalExpensesCard.className = classna;
  numberOfExpensesCard.className = classna;
  highestExpensesCard.className = classna;

  let cardHeight = "120px";
  totalExpensesCard.style.height = cardHeight;
  numberOfExpensesCard.style.height = cardHeight;
  highestExpensesCard.style.height = cardHeight;

  let h31 = document.createElement("h6");
  h31.innerHTML = " Total";
  let h61 = document.createElement("h6");
  h61.innerHTML = `${total}`;
  let div1 = document.createElement("div");
  div1.className = "d-grid justify-content-center";
  div1.appendChild(h31);
  div1.appendChild(h61);

  let h32 = document.createElement("h6");
  h32.innerHTML = "Number Of Expenses";
  let h62 = document.createElement("h6");
  h62.innerHTML = `${count}`;
  let div2 = document.createElement("div");
  div2.className = "d-grid justify-content-center";
  div2.appendChild(h32);
  div2.appendChild(h62);

  let h33 = document.createElement("h6");
  h33.innerHTML = "Highest Expenses";
  let h63 = document.createElement("h6");
  h63.innerHTML = `${max}`;
  let div3 = document.createElement("div");
  div3.className = "d-grid justify-content-center";
  div3.appendChild(h33);
  div3.appendChild(h63);

  totalExpensesCard.appendChild(div1);

  highestExpensesCard.appendChild(div2);

  numberOfExpensesCard.appendChild(div3);

  containerCard.appendChild(row);
  row.appendChild(totalExpensesCard);
  row.appendChild(numberOfExpensesCard);
  row.appendChild(highestExpensesCard);
  divCards.appendChild(containerCard);
}

function ShowDataForm(data) {
  let tableBody = document.getElementById("tableBody");
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = "";
  data.map((e) => {
    let row = tableBody.insertRow();
    row.insertCell(0).textContent = e.title;
    row.insertCell(1).textContent = e.amount;
    let categoryCell = row.insertCell(2);
    let bgColorbadge = "bg-primary";

    switch (e.category) {
      case "Food":
        bgColorbadge = "bg-success";
        break;
      case "Transport":
        bgColorbadge = "bg-info text-dark";
        break;
      case "Bills":
        bgColorbadge = "bg-danger";
        break;
      case "Entertainment":
        bgColorbadge = "bg-warning text-dark";
        break;
    }

    categoryCell.innerHTML = `<span class="badge ${bgColorbadge}">${e.category}</span>`;

    row.insertCell(3).textContent = e.date;
    let actionCell = row.insertCell(4);
    actionCell.className = "d-flex justify-content-center gap-2";
    let deleteButton = document.createElement("button");

    let updateButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    updateButton.textContent = "Update ";

    deleteButton.className = "btn btn-sm btn-danger me-2 w-50";
    updateButton.className = "btn btn-sm btn-warning w-50";
    deleteButton.addEventListener("click", async () => {
      DeleteExpense(e);
    });
    UpdateModel(updateButton, e);
    actionCell.appendChild(deleteButton);
    actionCell.appendChild(updateButton);
  });
}
document.getElementById("closeBtn").addEventListener("click", () => {
  document.getElementById("updateBox").style.display = "none";
});
document.getElementById("saveBtn").addEventListener("click", async () => {
  let id = document.getElementById("boxId").value;
  let title = document.getElementById("boxTitle").value;
  let amount = document.getElementById("boxAmount").value;

  let date = document.getElementById("boxDate").value;
  let category = document.getElementById("boxCategory").value;

  let newValues = {
    id: id,
    title: title,
    amount: amount,
    date: date,
    category: category,
  };
  await UpdateExpense(newValues);
  getAllExpenses(categoryFilterValue);
  document.getElementById("updateBox").style.display = "none";
});

async function UpdateExpense(newValues) {
  try {
    const response = await fetch(`${API_URL}/${newValues.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newValues),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Updated" + data.title + " Successfully ");
    }
  } catch (error) {
    alert(
      "Failed to update the expense. Please check your connection and try again.",
    );
  }
}

function UpdateModel(updateButton, e) {
  updateButton.addEventListener("click", () => {
    document.getElementById("boxId").value = e.id;
    document.getElementById("boxTitle").value = e.title;
    document.getElementById("boxAmount").value = e.amount;
    document.getElementById("boxDate").value = e.date;
    document.getElementById("boxCategory").value = e.category;
    document.getElementById("updateBox").style.display = "block";
  });
}

async function DeleteExpense({ id }) {
  try {
    let response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.deletedExpense.title + " " + data.message);
      getAllExpenses(categoryFilterValue);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert(
      "Failed to delete the expense. Please check your connection and try again.",
    );
  }
}

let addExpense = document.getElementsByClassName("addExpense")[0];

addExpense.addEventListener("click", async () => {
  let titleValue = document.getElementById("title").value;
  let amountValue = document.getElementById("amount").value;
  let categoryValue = document.getElementById("category").value;
  let dateValue = document.getElementById("date").value;
  if (!titleValue || !amountValue || !categoryValue || !dateValue) {
    alert("Please fill all fields");
    return;
  }
  if (amountValue <= 0) {
    alert("The amount must be greater than 0");
    return;
  }
  let newExpenseObject = {
    title: titleValue,
    amount: Number(amountValue),
    category: categoryValue,
    date: dateValue,
  };
  await AddExpense(newExpenseObject);
});

async function AddExpense(newExpenseObject) {
  try {
    let response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpenseObject),
    });
    let data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add the expense. Please try again.");
    }
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    getAllExpenses(categoryFilterValue);
  } catch (error) {
    alert(
      "Failed to add the expense. Please check your connection and try again.",
    );
  }
}

function OrderDataUsingColumn() {
  let tableHeader = document.getElementById("tableHeader");
  if (!tableHeader) return;

  tableHeader.addEventListener("click", (e) => {
    const column = e.target.closest("[data-order]");
    if (!column) return;
    const orderBy = column.dataset.order;
    const titleValue = document.getElementById("TitleForm")?.value || "";
    getAllExpenses(categoryFilterValue, orderBy, monthFilterValue, titleValue);
  });
}
OrderDataUsingColumn();
