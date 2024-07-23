document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const expenseContainer = document.getElementById('expense-container');
    let token;
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
  
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          token = data.token;
          expenseContainer.style.display = 'block';
          loginForm.style.display = 'none';
          registerForm.style.display = 'none';
          loadExpenses();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
  
      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          token = data.token;
          expenseContainer.style.display = 'block';
          loginForm.style.display = 'none';
          registerForm.style.display = 'none';
          loadExpenses();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    expenseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const amount = document.getElementById('expense-amount').value;
      const category = document.getElementById('expense-category').value;
      const date = document.getElementById('expense-date').value;
  
      try {
        const response = await fetch('http://localhost:5000/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, category, date }),
        });
  
        if (response.ok) {
          loadExpenses();
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    async function loadExpenses() {
      try {
        const response = await fetch('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const expenses = await response.json();
        expensesList.innerHTML = '';
        expenses.forEach((expense) => {
          const expenseItem = document.createElement('div');
          expenseItem.classList.add('expense-item');
          expenseItem.innerHTML = `
            <p>Amount: ${expense.amount}</p>
            <p>Category: ${expense.category}</p>
            <p>Date: ${new Date(expense.date).toLocaleDateString()}</p>
            <button onclick="deleteExpense('${expense._id}')">Delete</button>
            <button onclick="editExpense('${expense._id}')">Edit</button>
          `;
          expensesList.appendChild(expenseItem);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    window.deleteExpense = async function (id) {
      try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          loadExpenses();
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    window.editExpense = async function (id) {
      const amount = prompt('Enter new amount');
      const category = prompt('Enter new category');
      const date = prompt('Enter new date (yyyy-mm-dd)');
  
      try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, category, date }),
        });
  
        if (response.ok) {
          loadExpenses();
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  });
  