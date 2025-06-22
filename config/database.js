const sqlite3 = require('sqlite3').verbose();
const path =require('path');

const dbPath = path.join(__dirname, '..', 'data', 'movierates.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Błąd podczas łączenia z SQLite:', err.message);
    } else {
        console.log('Połączono SQLite.');
    }
});

module.exports = db;