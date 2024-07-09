const addExpenseBtn = document.querySelector(".add-expense-btn");
const expenseList = document.querySelector(".expense-list");
const totalExpenses = document.querySelector(".total-expenses h3");
const modal = document.getElementById("expense-modal");
const closeModalBtn = document.querySelector(".close-btn");
const saveExpenseBtn = document.getElementById("save-expense-btn");
const searchInput = document.getElementById("search");

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let total = 0;

function updateTotal() {
    total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
}

function renderExpenses() {
    let html = "";
    expenses.forEach((expense, index) => {
        html += `
            <div class="expense-item" data-index="${index}">
                <div class="expense-item-description">${expense.description}</div>
                <div class="expense-item-amount">$${expense.amount.toFixed(2)}</div>
                <div>${new Date(expense.date).toLocaleDateString()}</div>
                <button class="delete-expense-btn">&times;</button>
            </div>
        `;
    });
    expenseList.innerHTML = html;
    totalExpenses.innerText = `Total Expenses: $${total.toFixed(2)}`;
}

function addExpense() {
    const description = document.getElementById("expense-description").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const date = document.getElementById("expense-date").value;

    if (description && amount && date) {
        const expense = { description, amount, date };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateTotal();
        renderExpenses();
        closeModal();
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateTotal();
    renderExpenses();
}

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    document.getElementById("expense-description").value = '';
    document.getElementById("expense-amount").value = '';
    document.getElementById("expense-date").value = '';
}

function filterExpenses() {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll(".expense-item").forEach(item => {
        const description = item.querySelector(".expense-item-description").textContent.toLowerCase();
        if (description.includes(searchTerm)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

addExpenseBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
saveExpenseBtn.addEventListener("click", addExpense);

expenseList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-expense-btn")) {
        const index = event.target.parentElement.getAttribute("data-index");
        deleteExpense(index);
    }
});

window.addEventListener("click", function(event) {
    if (event.target == modal) {
        closeModal();
    }
});

searchInput.addEventListener("input", filterExpenses);

// Initial render
updateTotal();
renderExpenses();
