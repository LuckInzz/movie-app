import {useState, useEffect, useRef} from "react";
import Search from "./components/Search.jsx";
import Loading_Spinner from "./components/Loading_Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import { useDebounce } from 'react-use'
//import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList]= useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const allMoviesSectionRef = useRef(null);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try{
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();

            if (data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                setTotalPages(1);
                setCurrentPage(1);
                return;
            }

            setMovieList(data.results || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.total_pages || 1);
            /*console.log(data.results);*/

        } catch (error){
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage]);

    const scrollToMoviesSection = () => {
        if (allMoviesSectionRef.current) {
            allMoviesSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
            if(!isLoading)
                scrollToMoviesSection();
        }
    }

    const handleMovieClick = async (movie) => {
        const endpoint = `${API_BASE_URL}/movie/${movie.id}`;
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
            console.error('Failed to get especific movie.');
            setSelectedMovie(null);
            return;
        }

        const data = await response.json();
        setSelectedMovie(data);
        console.log(data);
    }

    const handleCloseMovieDetails = () => {
        setSelectedMovie(null);
        document.body.style.overflow="auto";
    }

    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <div className="logo mb-5">
                        <img src="./logo/logo-no-bg.png" className="h-40 w-auto object-contain brightness-175" />
                    </div>
                    <h1>TrendingFlix</h1>

                    <img src="./hero-img.png" alt="main-posters" />
                    <h1>Find All Bests Trending <span className="text-gradient">Movies</span> Of The Moment! </h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="trending">

                </section>

                <section ref={allMoviesSectionRef} className="all-movies">
                    <h2 className="mt-[20px]">Popular</h2>

                    {isLoading ? (
                        <Loading_Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id}
                                           movie={movie}
                                           onMovieClick={() => handleMovieClick(movie)}/>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="flex justify-center items-center mt-12 gap-15">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="cursor-pointer brightness-150 disabled:cursor-not-allowed disabled:opacity-50">
                        <img src="button-left.png" />
                    </button>
                    <p className="text-white text-tl font-semibold">{currentPage} / {totalPages}</p>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="cursor-pointer brightness-150 disabled:cursor-not-allowed disabled:opacity-50">
                        <img src="button-left.png" className="rotate-180"/>
                    </button>
                </section>
            </div>

            {selectedMovie && (
                <>
                    {/* Backdrop: Fundo escuro semi-transparente*/}
                    <div
                        className="fixed inset-0 bg-primary bg-opacity-75 z-40"
                        onClick={handleCloseMovieDetails}
                    ></div>

                    {/* Container do model: Centralizado e por cima de tudo*/}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                                    max-w-full max-h-[90%] overflow-y-auto shadow-[0_0_30px_0]
                                    shadow-purple-200 rounded-[8px] w-90 sm:w-150 md:w-180 lg:w-250">
                        <MovieDetails key={selectedMovie.id}
                                      movie={selectedMovie}
                                      closeMovieDetails={() => handleCloseMovieDetails()}/>
                    </div>
                </>
            )}
        </main>
    )
}

export default App;