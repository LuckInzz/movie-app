import { Color } from "ogl";
import React from "react";

const MovieDetails = ({movie, closeMovieDetails}) => {

    const formatRuntime = (minutes) => {
        if (!minutes) return "N/A";
        const h = Math.floor(minutes/60);
        const m = minutes % 60
        return `${h}h ${m}m`
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });
    }

    const getDate = (dateString, part) => {
        if (!dateString) return "N/A";
        const parts = dateString.split("-")
        return parts[part]
    }

  
    const formatMoney = (value) => {
        if (!value || value === 0) return "N/A";
        if (value >= 1_000_000_000) {
            return `$${(value / 1_000_000_000).toFixed(1)} Billion`;
        } else if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(1)} Million`;
        } else if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(1)}K`;
        }
        return `$${value}`;
    };


    return (
        <div className="movie-details-container bg-dark-100  px-4 md:px-8 pt-1 pb-1">

            <header className="flex flex-row justify-between items-center">
                <h2 className="text-[20px] sm:text-[25px] text-center">{movie.title}</h2>

                <div className="flex items-center gap-2">
                    <div className="flex items-center font-bold bg-dark-200 rounded-[5px] h-8 w-18 md:h-10 md:w-22 p-2 text-[12px] md:text-[16px]">
                        <img className="h-4 md:h-5 mr-1" src="star.svg" alt="Star Icon" />
                        <p className="text-white">
                            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                        </p>
                        <p className="text-gray-100">/10</p>
                    </div>

                    <div className="flex">
                        <button className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 bg-dark-200 rounded-[5px] font-bold text-white cursor-pointer" onClick={closeMovieDetails}>
                            <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="CurrentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex flex-row mb-5">
                <h2 className="text-light-100 text-[15px] mr-2">{getDate(movie.release_date, 0)}</h2>
                <h2 className="text-light-100 text-[15px]"> | </h2>
                <h2 className="text-light-100 text-[15px] ml-2">{formatRuntime(movie.runtime)}</h2>
            </div>
            

                <div className="flex flex-row items-center justify-between">
                    <img className="rounded-lg w-auto h-32 sm:h-55 md:h-65 lg:h-92" src={movie.poster_path ?
                        `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie-v.png'} alt="poster"/>

                    <img className = "rounded-lg w-auto h-32 sm:h-55 md:h-65 lg:h-92" src={movie.backdrop_path ?
                        `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}` : '/no-movie-h.png'} alt="backdrop"/>
                </div>

            <div className="mt-8">

                <div className="details">
                    <h3 className="text1">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genres) => (
                            <span key={genres.id} className="bg-dark-200 text-light-100 text-[15px] px-3 py-1 rounded-[5px]">{genres.name}</span>
                        ))}
                    </div>
                </div>

                <div className="details">
                    <h3 className="text1">Overview</h3>
                    <h3 className="text-light-100">{movie.overview}</h3>
                </div>

                <div className="details">
                    <h3 className="text1">Tagline</h3>
                    <h3 className="text-light-100">{movie.tagline}</h3>
                </div>

                <div className="details">
                    <h3 className="text1">Release Date</h3>
                    <h3 className="text-light-100">{formatDate(movie.release_date)}</h3>
                </div>

                <div className="details">
                    <h3 className="text1">Budget</h3>
                    <h3 className="text-light-100">{formatMoney(movie.budget)}</h3>
                </div>

                <div className="details">
                    <h3 className="text1">Revenue</h3>
                    <h3 className="text-light-100">{formatMoney(movie.revenue)}</h3>
                </div>

                <div className="details">
                    <h3 className="text1">Production Companies</h3>
                    <div>
                        {movie.production_companies.map((company, index) =>(
                            <span key={company.id} className="text-light-100">
                                {company.name}({company.origin_country})
                                {index < movie.production_companies.length - 1 && (<span> • </span>)}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MovieDetails