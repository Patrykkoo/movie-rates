const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static create(username, password, callback) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return callback(err);
            }
            const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
            db.run(sql, [username, hash], function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null, { id: this.lastID, username });
            });
        });
    }

    static findByUsername(username, callback) {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.get(sql, [username], (err, user) => {
            callback(err, user);
        });
    }

    static verifyPassword(password, hashedPassword, callback) {
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                return callback(err);
            }
            callback(null, isMatch);
        });
    }
}

module.exports = User;