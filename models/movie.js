const db = require('../config/database');

class Movie {
    static fetchAll(callback) {
        const sql = `
            SELECT 
                m.*, 
                AVG(r.rating) as averageRating, 
                COUNT(r.id) as reviewCount
            FROM movies m
            LEFT JOIN reviews r ON m.id = r.movie_id
            GROUP BY m.id
            ORDER BY m.title;
        `;
        db.all(sql, [], (err, rows) => callback(err, rows));
    }

    static findById(id, callback) {
        const sql = "SELECT * FROM movies WHERE id = ?";
        db.get(sql, [id], (err, row) => callback(err, row));
    }

    static addOrUpdateStatus(userId, movieId, status, callback) {
        const sql = "REPLACE INTO user_movie_status (user_id, movie_id, status) VALUES (?, ?, ?)";
        db.run(sql, [userId, movieId, status], (err) => callback(err));
    }

    static fetchCollectionForUser(userId, callback) {
        const sql = `
            SELECT m.*, ums.status 
            FROM movies m 
            JOIN user_movie_status ums ON m.id = ums.movie_id 
            WHERE ums.user_id = ?`;
        db.all(sql, [userId], (err, rows) => callback(err, rows));
    }

    static fetchReviewsForMovie(movieId, callback) {
        const sql = `
            SELECT r.rating, r.review_text, u.username 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.movie_id = ?
            ORDER BY r.id DESC`;
        db.all(sql, [movieId], (err, rows) => callback(err, rows));
    }

    static addOrUpdateReview(userId, movieId, rating, review_text, callback) {
        const checkSql = "SELECT id FROM reviews WHERE user_id = ? AND movie_id = ?";
        db.get(checkSql, [userId, movieId], (err, row) => {
            if (err) return callback(err);

            if (row) {
                const updateSql = "UPDATE reviews SET rating = ?, review_text = ? WHERE id = ?";
                db.run(updateSql, [rating, review_text, row.id], (err) => callback(err));
            } else {
                const insertSql = "INSERT INTO reviews (user_id, movie_id, rating, review_text) VALUES (?, ?, ?, ?)";
                db.run(insertSql, [userId, movieId, rating, review_text], (err) => callback(err));
            }
        });
    }
}

module.exports = Movie;