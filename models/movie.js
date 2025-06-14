const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'movieDB.json');

class Movie {
    static fetchAll() {
        try {
            const fileContent = fs.readFileSync(dbPath, 'utf-8');
            const data = JSON.parse(fileContent);
            return data.movies || [];
        } catch (error) {
            console.error("Błąd podczas odczytu bazy filmów:", error);
            return [];
        }
    }

    // metody...
}

module.exports = Movie;