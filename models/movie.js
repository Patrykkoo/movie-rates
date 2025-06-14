const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '..', 'data', 'movieDB.json');
const collectionPath = path.join(__dirname, '..', 'data', 'user-collection.json');

const readDb = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (fileContent.trim() === '') {
            return filePath.includes('user-collection') ? [] : { genres: [], movies: [] };
        }
        return JSON.parse(fileContent);
    } catch (error) {
        return filePath.includes('user-collection') ? [] : { genres: [], movies: [] };
    }
};

const writeDb = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Błąd podczas zapisywania do pliku ${filePath}:`, error);
    }
};

class Movie {
    static fetchAll() {
        return readDb(dbPath).movies || [];
    }

    static findById(id) {
        const movies = this.fetchAll();
        return movies.find(m => m.id.toString() === id.toString());
    }

    static save(movie) {
        const db = readDb(dbPath);
        movie.id = crypto.randomUUID();
        db.movies.push(movie);
        writeDb(dbPath, db);
    }

    static fetchCollection() {
        return readDb(collectionPath);
    }

    static addToCollection(movieId) {
        const movieToAdd = this.findById(movieId);
        if (!movieToAdd) return;

        const collection = this.fetchCollection();
        const isAlreadyInCollection = collection.some(m => m.id.toString() === movieId.toString());

        if (!isAlreadyInCollection) {
            movieToAdd.status = 'Do obejrzenia';
            movieToAdd.rating = null;
            movieToAdd.review = '';
            
            collection.push(movieToAdd);
            writeDb(collectionPath, collection);
        }
    }

    static updateInCollection(id, updatedData) {
        const collection = this.fetchCollection();
        const movieIndex = collection.findIndex(m => m.id.toString() === id.toString());
        
        if (movieIndex > -1) {
            collection[movieIndex] = { ...collection[movieIndex], ...updatedData };
            writeDb(collectionPath, collection);
        }
    }
}

module.exports = Movie;