let db;
const request = indexedDB.open('budget_tracker', 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true })
};

request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // if app is online run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        // uploadPizza();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_budget');

    budgetObjectStore.add(record);
};

function uploadBudgetEvent() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
  
   
    const budgetObjectStore = transaction.objectStore('new_budget');
  
    const getAll = budgetObjectStore.getAll();
getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['new_budget'], 'readwrite');
          const budgetObjectStore = transaction.objectStore('new_budget');
          budgetObjectStore.clear();

          alert('transaction submitted successfully');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
    
  }

 
  window.addEventListener('online', uploadBudgetEvent);




