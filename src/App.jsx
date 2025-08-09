import {useState, useEffect, useRef, use} from "react";
import './index.css';
import Search from "./components/Search.jsx";
import DropdownBtn from "./components/DropdownBtn.jsx";
import Loading_Spinner from "./components/Loading_Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import LightRays from "./components/LightRays.jsx";
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
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [listGenres, setListGenres] = useState([]);

    const allMoviesSectionRef = useRef(null);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 750, [searchTerm]);

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try{
            let endpoint = '';

            if (query) {
                // 1. Prioridade para busca por texto
                endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
            } else if (selectedGenres) {
                // 2. Se não houver busca, use o gênero selecionado
                endpoint = `${API_BASE_URL}/discover/movie?with_genres=${selectedGenres.join(',')}&page=${page}&sort_by=popularity.desc`;
            } else {
                // 3. Se não houver nem busca nem gênero, mostre os mais populares
                endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
            }

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
    }, [debouncedSearchTerm, currentPage, selectedGenres]);

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

    const handleGenreClick = (genreID) => { //GenreID
        setSelectedGenres(prevGenres => {
            if(prevGenres.includes(genreID)){
                return prevGenres.filter(id => id !== genreID);
            }
            else {
                return [...prevGenres, genreID] 
            }
        });
        setCurrentPage(1)
    }

    const handleClearGenres = () => {
        setSelectedGenres([])
    }

    useEffect(() => {  //Make only 1 fetch to DB to get all Genres
        const fetchGenres = async () => {
            const endpoint = `${API_BASE_URL}/genre/movie/list`;
            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                console.error('Failed to get genres.');
                setListGenres([]);
                return;
            }
            const data = await response.json();
            setListGenres(data.genres || []);
        }
        fetchGenres();
    }, []);

    return (
        <main>

            <div style={{ width: '100%', height: '600px', position: 'absolute', zIndex: -1}}>
                <LightRays
                    raysOrigin="top-center"
                    raysColor="cecefb"
                    raysSpeed={1}
                    lightSpread={1}
                    rayLength={0.6}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    pulsating={true}
                    className="custom-rays"
                />
            </div>

            <div className="wrapper">
                <header>
                    <img src="./logo/logo-no-bg.png" className="h-30 w-auto object-contain brightness-175" />
                    <h1>TrendingFlix</h1>

                    <img src="./hero-img.png" alt="main-posters" />
                    <h1>Find All Bests Trending <span className="text-gradient">Movies</span> Of The Moment! </h1>

                    <div className="flex items-center justify-center flex-col xs:flex-row mt-10 mb-10 gap-6">
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <div className="flex items-center ml-10">
                            <DropdownBtn onGenreClick={handleGenreClick} listGenres={listGenres} selectedGenres={selectedGenres}/>
                            <button 
                                onClick={handleClearGenres}
                                className={`flex items-center justify-center h-10 w-10 p-2 rounded-lg text-light-100 
                                        bg-red-500/20 backdrop-blur-sm transition-all duration-300 ease-in-out
                                        ${selectedGenres.length > 0
                                        ? 'opacity-100 translate-x-[12px] z-10 animate-bounce cursor-pointer hover:bg-red-800' // Estado VISÍVEL
                                        : 'opacity-0 translate-x-0 z-0'         // Estado ESCONDIDO
                                }`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    </div>
                </header>

                <section ref={allMoviesSectionRef} className="all-movies">
                    <h2 className="mt-[20px]">Trending</h2>

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

                <div className="flex justify-center items-center mt-12 gap-15">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} 
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                        <img src="button-left.png" />
                    </button>

                    <p className="text-white text-tl font-semibold">{currentPage} / {totalPages}</p>

                    <button onClick={handleNextPage} disabled={currentPage === totalPages} 
                    className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                        <img src="button-left.png" className="rotate-180"/>
                    </button>
                </div>
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
                                    shadow-purple-200 rounded-[8px] w-90 sm:w-150 md:w-180 lg:w-250 hide-scrollbar">
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