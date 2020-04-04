// Movie Constructor
function Movie(title, genre, year) {
    this.title = title;
    this.genre = genre;
    this.year = year;
}



//UI constroctor
function UI() { }

//Add movie to list
UI.prototype.addMovieToList = function (movie) {
    const list = document.getElementById("movie-list");
    // Create tr element
    const row = document.createElement('tr');
    //Insert columns
    row.innerHTML = `
    <td>${movie.title}</td>
    <td>${movie.genre}</td>
    <td>${movie.year}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
}

//Show Alert
UI.prototype.showAlert = function (message, className) {
    //Create div
    const div = document.createElement('div');
    // Add class
    div.className = `alert ${className}`;
    // Add Text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // Get Form
    const form = document.querySelector('#movie-form');
    // Insert Alert
    container.insertBefore(div, form);
    //Timeout after 3 seconds
    setTimeout(function () {
        document.querySelector('.alert').remove();

    }, 3000);
}

// Delete Movie
UI.prototype.deleteMovie = function (target) {
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}

//Clear fields
UI.prototype.clearFields = function () {
    document.getElementById("title").value = ""
    document.getElementById("genre").value = ""
    document.getElementById("year").value = ""
}

// local Storage Class
class Store {
    static getMovies() {
        let movies;
        if (localStorage.getItem('movies') === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem('movies'));
        }
        return movies;
    }

    static displayMovies() {
        const movies = Store.getMovies();

        movies.forEach(function (movie) {
            const ui = new UI;

            // Add Movie to UI
            ui.addMovieToList(movie);
        })
    }

    static addMovie(movie) {
        const movies = Store.getMovies();

        movies.push(movie);

        localStorage.setItem('movies', JSON.stringify(movies));
    }

    static removeMovie(title) {
        const movies = Store.getMovies();

        movies.forEach(function (movie, index) {
            if (movie.title === title) {
                movies.splice(index, 1);
            }
        });
        localStorage.setItem('movies', JSON.stringify(movies));

    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayMovies);

// Event Listener for Adding
document.getElementById('movie-form').addEventListener('submit', function (e) {
    // Get form values
    const title = document.getElementById("title").value,
        genre = document.getElementById("genre").value,
        year = document.getElementById("year").value;
    // Instantiate a Movie
    const movie = new Movie(title, genre, year);

    // Instantuate UI
    const ui = new UI();

    //Validate 
    if (title === '' || genre === '' || year === '') {
        //Error alert
        ui.showAlert('Please fill in all fields', 'error')
    } else {
        // Add Movie to list
        ui.addMovieToList(movie);

        //Add to lcal storage
        Store.addMovie(movie);

        // Show Success
        ui.showAlert('Movie Added!', 'success');

        // Clear Fields
        ui.clearFields();
    }



    e.preventDefault();
});

// Event Listener for Delete
document.getElementById('movie-list').addEventListener('click', function (e) {
    // Instantuate UI
    const ui = new UI();

    // Delete movie
    ui.deleteMovie(e.target);

    // Remove from Local Storage
    Store.removeMovie(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show Message
    ui.showAlert('Movie Removed!', 'success')

    e.preventDefault();
})