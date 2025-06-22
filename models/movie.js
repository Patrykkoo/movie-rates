const db = require('../config/database');

class Movie {
    static fetchAll(callback) {
        const sql = "SELECT * FROM movies ORDER BY title";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error("Błąd przy pobieraniu filmów:", err.message);
                return callback(err, null);
            }
            callback(null, rows);
        });
    }

    static findById(id, callback) {
        const sql = "SELECT * FROM movies WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error(`Błąd przy szukaniu filmu o ID ${id}:`, err.message);
                return callback(err, null);
            }
            callback(null, row);
        });
    }

    static addOrUpdateStatus(userId, movieId, status, callback) {
        const sql = "REPLACE INTO user_movie_status (user_id, movie_id, status) VALUES (?, ?, ?)";
        
        db.run(sql, [userId, movieId, status], function(err) {
            callback(err);
        });
    }

    static fetchCollectionForUser(userId, callback) {
        const sql = `
            SELECT m.*, ums.status
            FROM movies m
            JOIN user_movie_status ums ON m.id = ums.movie_id
            WHERE ums.user_id = ?
        `;

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                console.error("Błąd przy pobieraniu kolekcji użytkownika:", err.message);
                return callback(err, null);
            }
            callback(null, rows);
        });
    }
}

module.exports = Movie;