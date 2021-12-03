let db;
const request = indexedDB.open('budget_tracker', 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true })
};


request.onsuccess = function (event) {
    console.log('db saved to global')
    db = event.target.result;
    if (navigator.onLine) {
    
    }
};