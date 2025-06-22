const db = require('../config/database');

class Movie {
    static fetchAll(callback) {
        const sql = "SELECT * FROM movies ORDER BY title";

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error("Błąd przy pobieraniu filmów:", err.message);
                callback(err, null);
                return;
            }
            callback(null, rows);
        });
    }

    static findById(id, callback) {
        const sql = "SELECT * FROM movies WHERE id = ?";

        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error(`Błąd przy szukaniu filmu o ID ${id}:`, err.message);
                callback(err, null);
                return;
            }
            callback(null, row);
        });
    }

}

module.exports = Movie;