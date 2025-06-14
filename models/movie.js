const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', 'data', 'movieDB.json');

const readDb = () => {
    try {
        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Błąd podczas odczytu bazy filmów:", error);
        return { genres: [], movies: [] };
    }
};

const writeDb = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Błąd podczas zapisywania do bazy filmów", error);
    }
};

class Movie {
    static fetchAll() {
        return readDb().movies || [];
    }

    static findById(id) {
        const movies = this.fetchAll();
        return movies.find(m => m.id.toString() === id.toString());
    }

    static update(id, updateMovieData) {
        const db = readDb();
        const movieIndex = db.movies.findIndex(m => m.id.toString() === id.toString());

        if (movieIndex > -1) {
            const movie = db.movies[movieIndex];
            db.movies[movieIndex] = { ...movie, ...updatedMovieData };
            writeDb(db);
        }
    }

    static save(movie) {
        const db = readDb();

        movie.id = crypto.randomUUID();
        movie.status = 'Do obejrzenia';
        movie.rating = movie.rating || null;
        movie.review = movie.review || '';
        
        db.movies.push(movie);
        writeDb(db);
    }
}

module.exports = Movie;