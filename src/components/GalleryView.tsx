import React from "react";
import styles from "../styles/FilterView.module.css";
import {useState} from "react";
import { useEffect } from "react";
import { useMemo } from "react";

import { TMDB_IMAGE_BASE, tmdbGenre } from "../utils/tmdbClient";
import { tmdbMovie } from "../utils/tmdbClient";
import fetchGenres from "../utils/apis/fetchGenres";


const genreList = ["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Science Fiction", "Thriller"];


function readMoviesFromLS(){
    const LS_KEY = "movie_cache_v1";
    try{
        const cachedData = localStorage.getItem(LS_KEY);
        if (cachedData) {
            const parsed =  JSON.parse(cachedData);
            if(parsed?.movieList && Array.isArray(parsed.movieList)){
                return parsed.movieList as tmdbMovie[];
            }
        }
        return [];
    } catch (error) {
        console.error("Failed to read movies from localStorage", error);
        return [];
    }
}


function GalleryView() {

    const [activeGenre, setActiveGenre] = useState("All");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState<tmdbGenre[] | []>([]);
    const [movies, setMovies] = useState<tmdbMovie[] | []>([]);
    
    const loadGenres = async () => {
        setError(null);
        try{
            setLoading(true);
            const genres = await fetchGenres();
            setGenre(genres);
        }catch(e){
            console.error("Failed to fetch genres", e);
            setError("Failed to load genres. Please try again later.");
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {        
        loadGenres();
        setMovies(readMoviesFromLS());
    }, []);

    const handleRetry = async () => {
        setError(null);
        setLoading(true);
        try {
            await loadGenres();
            setMovies(readMoviesFromLS());
        } catch (e) {
            console.error('Retry failed', e);
            setError('Failed to load gallery. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    

    const filtered = useMemo(() => { 
        if(activeGenre === "All") return movies;

        return movies.filter(movie => {

            if(! Array.isArray(movie.genre_ids)) return false;

            const names = movie.genre_ids.map(id => {
                const g = genre.find(g => g.id === id);
                return g ? g.name : null;
            }).filter(n => n !== null); // remove nulls

            return names.includes(activeGenre);
        });


    },[movies, genre, activeGenre]);

    return (
        <div className={styles.container}>

            <div className={styles.filters}>
                {genreList.map((genre) => (
                    <button
                        key = {genre}
                        className = {`${styles.filterButton} ${activeGenre === genre ? styles.active : ""}`}
                        onClick = {() => setActiveGenre(genre)}
                    >
                        {(genre === "Science-Fiction") ? "Sci-Fi" : genre}
                    </button>                
                ))}       
            </div>
            
            <div className={styles.gallery}>
                {loading ? (
                    <div className={styles.noResults} aria-busy="true">Loading gallery…</div>
                ) : error ? (
                    <div className={styles.noResults}>
                        <div>{error}</div>
                        <button className={styles.filterButton} onClick={handleRetry}>Retry</button>
                    </div>
                ) : (
                    filtered.map(movie => (
                        <div key={movie.id} className={styles.card}>
                            {movie.poster_path ? (
                                <img
                                    src={`${TMDB_IMAGE_BASE}/w200${movie.poster_path}`}
                                    alt={movie.title}
                                    className={styles.poster}
                                />
                            ) : (
                                <div className={styles.noPoster}>No Image</div>
                            )}
                        </div>
                    ))
                )}
            </div>
            
        </div>
    );
}

export default GalleryView;