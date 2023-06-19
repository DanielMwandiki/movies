import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Pagination from './Pagination';
import SortOptions from './SortOptions';

const API_KEY = 'c047177e';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=`;

function App() {
  const [searchText, setSearchText] = useState('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const movieDetailsRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (movieDetailsRef.current && !movieDetailsRef.current.contains(event.target)) {
      setSelectedMovie(null);
    }
  };

  const handleSearch = () => {
    let url = `${API_URL}${searchText}&page=${currentPage}`;

    if (sortBy) {
      url += `&type=movie&sort=${sortBy}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === 'True') {
          setMovies(data.Search);
          setTotalPages(Math.ceil(data.totalResults / 10)); // Assuming 10 movies per page
          setErrorMessage('');
        } else {
          setMovies([]);
          setErrorMessage(data.Error);
          setTotalPages(0);
        }
      })
      .catch((err) => {
        console.log(err);
        setMovies([]);
        setErrorMessage('An error occurred. Please try again later.');
        setTotalPages(0);
      });
  };

  const movieSelected = (imdbID) => {
    console.log(`Movie selected: ${imdbID}`);
    fetch(`${API_URL}&i=${imdbID}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedMovie(data);
      })
      .catch((err) => {
        console.log(err);
        setSelectedMovie(null);
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="container">
      <div className="logo">
        <h1>Find <span>Movies</span></h1>
      </div>

      <div className="input-group">
        <input
          type="search"
          placeholder="Enter Movie Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>Search</button>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <SortOptions sortBy={sortBy} handleSortChange={handleSortChange} />

      <div id="movies" className="movieinfo">
        {movies.map((movie) => (
          <div key={movie.imdbID}>
            <div className="well text-center">
              <img src={movie.Poster} alt={movie.Title} />
              <h5>{movie.Title}</h5>
              <button onClick={() => movieSelected(movie.imdbID)}>Movie Details</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {selectedMovie && (
        <div className="movie-details" ref={movieDetailsRef}>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
          <h2>{selectedMovie.Title}</h2>
          <p>Rating: {selectedMovie.imdbRating}</p>
          <p>Year: {selectedMovie.Year}</p>
          <p>Cast: {selectedMovie.Actors}</p>
          <p>Genre: {selectedMovie.Genre}</p>
          <p>Plot: {selectedMovie.Plot}</p>
        </div>
      )}
    </div>
  );
}

export default App;
