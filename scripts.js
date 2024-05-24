fetchMostSearchedMovies();

function searchMovie() {
    var searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm === '') {
        alert('Please enter a movie title.');
        return;
    }

    var omdbApiUrl = 'http://www.omdbapi.com/?s=' + searchTerm + '&apikey=7f1d5f47';

    showLoading();

    axios.get(omdbApiUrl)
        .then(function (response) {
            hideLoading();

            var movies = response.data.Search;
            if (!movies) {
                alert('No movies found with that title.');
                return;
            }

            var movieDetailsContainer = document.getElementById('movieDetails');
            movieDetailsContainer.innerHTML = '';

            var movie = movies[0];
            var imdbID = movie.imdbID;
            var movieDetailsUrl = 'http://www.omdbapi.com/?i=' + imdbID + '&apikey=7f1d5f47';

            axios.get(movieDetailsUrl)
                .then(function (detailsResponse) {
                    var movieDetails = detailsResponse.data;
                    var trailerUrl = 'https://www.youtube.com/embed/VIDEO_ID_HERE';
                    var movieDetailsHTML = `
                        <div class="movie-details">
                            <img src="${movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}" alt="${movieDetails.Title} Poster">
                            <div>
                                <h2>${movieDetails.Title}</h2>
                                <p>IMDB Rating: ${movieDetails.imdbRating}</p>
                                <p>Language: ${movieDetails.Language}</p>
                                <p>Director: ${movieDetails.Director}</p>
                                <p>Producer: ${movieDetails.Production}</p>
                                <p>Cast: ${movieDetails.Actors}</p>
                                <iframe width="100%" height="280" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>
                    `;
                    movieDetailsContainer.innerHTML = movieDetailsHTML;
                })
                .catch(function (error) {
                    console.error('Error fetching movie details: ', error);
                    alert('An error occurred. Please try again later.');
                });
        })
        .catch(function (error) {
            console.error('Error fetching data: ', error);
            alert('An error occurred. Please try again later.');
            hideLoading();
        });
}

function fetchMostSearchedMovies() {
    var mostSearchedMoviesContainer = document.getElementById('mostSearchedMovies');
    var omdbApiUrl = 'http://www.omdbapi.com/?s=most&type=movie&apikey=7f1d5f47';

    showLoading();

    axios.get(omdbApiUrl)
        .then(function (response) {
            hideLoading();
            var mostSearchedMovies = response.data.Search;
            if (mostSearchedMovies) {
                var mostSearchedMoviesHTML = '<h2>Most Searched Movies</h2><div class="row">';
                for (var i = 0; i < mostSearchedMovies.length; i++) {
                    var mostSearchedMovie = mostSearchedMovies[i];
                    var mostSearchedMovieHTML = `
                        <div class="col-md-3 most-searched-movie">
                            <div class="movie-info" onmouseover="showMovieName(this, '${mostSearchedMovie.Title}')" onmouseout="hideMovieName(this)" onclick="showMovieDetails('${mostSearchedMovie.imdbID}')">
                                <img src="${mostSearchedMovie.Poster !== 'N/A' ? mostSearchedMovie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}" alt="${mostSearchedMovie.Title} Poster">
                                <div class="movie-name">${mostSearchedMovie.Title}</div>
                            </div>
                        </div>
                    `;
                    mostSearchedMoviesHTML += mostSearchedMovieHTML;
                    if ((i + 1) % 4 === 0) {
                        mostSearchedMoviesHTML += '</div><div class="row">';
                    }
                }
                mostSearchedMoviesHTML += '</div>';
                mostSearchedMoviesContainer.innerHTML = mostSearchedMoviesHTML;
            }
        })
        .catch(function (error) {
            console.error('Error fetching most searched movies: ', error);
            alert('An error occurred while fetching most searched movies. Please try again later.');
            hideLoading();
        });
}

function showMovieName(element, title) {
    var movieName = element.querySelector('.movie-name');
    movieName.style.display = 'block';
}

function hideMovieName(element) {
    var movieName = element.querySelector('.movie-name');
    movieName.style.display = 'none';
}

function showMovieDetails(imdbID) {
    var movieDetailsUrl = 'http://www.omdbapi.com/?i=' + imdbID + '&apikey=7f1d5f47';
    var youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=official+trailer+' + imdbID + '&key=AIzaSyCHum-mkwNlLMZtSFksZA9KWcXrd4Wds_A';

    showLoading();

    axios.get(movieDetailsUrl)
        .then(function (response) {
            var movieDetails = response.data;
            axios.get(youtubeApiUrl)
                .then(function (trailerResponse) {
                    var trailer = trailerResponse.data.items[0];
                    var trailerUrl = trailer ? 'https://www.youtube.com/embed/' + trailer.id.videoId : 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                    var movieDetailsContainer = document.getElementById('movieDetails');
                    var trailerHTML = `
                        <div class="movie-details">
                            <img src="${movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'}" alt="${movieDetails.Title} Poster">
                            <div>
                                <h2>${movieDetails.Title}</h2>
                                <p>IMDB Rating: ${movieDetails.imdbRating}</p>
                                <p>Language: ${movieDetails.Language}</p>
                                <p>Director: ${movieDetails.Director}</p>
                                <p>Producer: ${movieDetails.Production}</p>
                                <p>Cast: ${movieDetails.Actors}</p>
                                <iframe width="100%" height="280" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
                            </div>
                        </div>
                    `;
                    movieDetailsContainer.innerHTML = trailerHTML;
                    hideLoading();
                })
                .catch(function (error) {
                    console.error('Error fetching trailer: ', error);
                    alert('An error occurred while fetching the trailer. Please try again later.');
                    hideLoading();
                });
        })
        .catch(function (error) {
            console.error('Error fetching movie details: ', error);
            alert('An error occurred. Please try again later.');
            hideLoading();
        });
}

function showLoading() {
    document.getElementById('loadingContainer').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingContainer').style.display = 'none';
}

function toggleBorder() {
    var input = document.getElementById('searchInput');
    if (input.value.trim() !== '') {
        input.classList.add('has-content');
    } else {
        input.classList.remove('has-content');
    }
}
