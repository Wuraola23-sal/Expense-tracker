// Selectors for accessing HTML elements
const balanceEl = document.getElementById('balance-amount');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

const formatter = new Intl.NumberFormat('en-EN', {
  style: 'currency',
  currency: 'GBP',
})

function addTransaction(event) {
  event.preventDefault(); // prevents submitting the form 

  if (nameInput.value.trim() === '' || amountInput.value.trim() === '') {
    alert('Please add transaction name and amount');
  } else {
    const transaction = {
      id: generateID(),
      name: nameInput.value,
      amount: +amountInput.value
    };
    
    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    nameInput.value = '';
    amountInput.value = '';
  }
}

function addTransactionDOM(transaction) {
  const li = document.createElement('li');
    
  li.innerHTML = `
    <div class="name">
      <h3>${transaction.name}</h3>
    </div>

    <div class="amount">
      <span>${formatter.format(transaction.amount)}</span>
      </div>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Delete</button>
    
  `;

  list.appendChild(li);
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
  
    updateLocalStorage();
    init();
  }

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) * -1)
    .toFixed(2);

  balanceEl.innerText = `£${total}`;
  moneyPlusEl.innerText = `£${income}`;
  moneyMinusEl.innerText = `£${expense}`;
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialise the app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Event listener for form submission
form.addEventListener('submit', addTransaction);

// Generate unique ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}
