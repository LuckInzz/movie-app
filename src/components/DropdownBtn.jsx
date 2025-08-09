import React from "react";
import { useState } from "react";

const DropdownBtn = ({ onGenreClick, listGenres, selectedGenres }) => {

    const [showGenre, setShowGenre] = useState(false)
    const [isVisible, setIsVisible] = useState(false); // controla renderização no DOM

    const handleToggle = () => {
        if (showGenre) {
        // Fechando: animação hide antes de remover do DOM
        setShowGenre(false);
        setTimeout(() => {
            setIsVisible(false);
        }, 500); // mesmo tempo da animação
        } else {
        // Abrindo: renderiza e aplica reveal
        setIsVisible(true);
        setShowGenre(true)
        }
    };

    return(
        <div className="flex justify-center">
            <button onClick={handleToggle} className="relative flex items-center justify-between 
            gap-2 w-35 h-16 px-4 rounded-lg text-light-100 bg-light-100/5 backdrop-blur-sm transition-all duration-300
            hover:bg-light-100/10 cursor-pointer hover:scale-105">
                Genre
                <svg className=" h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="CurrentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>

            {isVisible && (
                <div className={`grid grid-cols-2 gap-2 p-2 absolute mt-20 rounded-lg bg-light-100/5 backdrop-blur-[64px] border border-light-100/10 
                overflow-hidden animate-reveal z-1 ${showGenre ? "animate-reveal" : "animate-hide"}`}>
                    {listGenres.map((genre, index) => (
                        <button key={index} onClick={() => onGenreClick(genre.id)} 
                        className={`px-3 py-2 rounded-lg text-light-100 cursor-pointer transition-color 
                            ${selectedGenres.includes(genre.id) ? 'bg-light-100/10' : 'hover:bg-light-100/10'}`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DropdownBtn