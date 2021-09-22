let db;
const request = indexedDB.open("budget", 1); 

request.onupgradeneeded = (event) => {
    // Create object store called "pending"
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
    // If app is online read data from db
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = (event) => {
    console.log(event.target.errorCode);
}; 