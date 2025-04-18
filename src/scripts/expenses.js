
// Initialize expenses array from localStorage or empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const monthFilter = document.getElementById('monthFilter');
const ctx = document.getElementById('expenseChart').getContext('2d');

// Chart initialization
let expenseChart;

// Initialize chart
function initializeChart(data) {
    if (expenseChart) {
        expenseChart.destroy();
    }

    const categoryTotals = calculateCategoryTotals(data);
    
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6B6B', '#4ECDC4', '#45B7D1', 
                    '#96CEB4', '#FFEEAD', '#D4A5A5'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Calculate totals by category
function calculateCategoryTotals(expenses) {
    return expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add new expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newExpense = {
        id: Date.now(),
        category: document.getElementById('category').value,
        amount: document.getElementById('amount').value,
        date: document.getElementById('date').value,
        note: document.getElementById('note').value
    };
    
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    displayExpenses(expenses);
    expenseForm.reset();
});

// Display expenses in table
function displayExpenses(expensesToShow) {
    expenseList.innerHTML = '';
    
    expensesToShow.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    expensesToShow.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${expense.category}</td>
            <td>$${parseFloat(expense.amount).toFixed(2)}</td>
            <td>${expense.note}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        `;
        expenseList.appendChild(row);
    });
    
    initializeChart(expensesToShow);
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses(expenses);
    }
}

// Filter expenses by month
monthFilter.addEventListener('change', () => {
    const selectedMonth = monthFilter.value;
    if (selectedMonth === '') {
        displayExpenses(expenses);
        return;
    }
    
    const filteredExpenses = expenses.filter(expense => {
        const expenseMonth = new Date(expense.date).getMonth() + 1;
        return expenseMonth.toString() === selectedMonth;
    });
    
    displayExpenses(filteredExpenses);
});

// Initial display
displayExpenses(expenses);
