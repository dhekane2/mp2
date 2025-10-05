import React from "react";
import { useState , useMemo, useDeferredValue } from "react";
import useDebouncedValue from "../utils/hooks/useDebouncedValue";
import styles from '../styles/ListView.module.css';
import {tmdbMovie} from '../utils/tmdbClient';
import fetchTopMovies from "../utils/apis/fetchTopMovies";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type sortKey = "title" | "rank";
type sortOrder = "asc" | "desc";

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


function ListView() {
    const [searchTerm, setSearchTerm] = useState("");
    
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 200); // help with performance on large lists
    const deferredSearchTerm = useDeferredValue(debouncedSearchTerm); // avoid flicker when typing fast

    const [MOVIES, setMOVIES] = useState<tmdbMovie[] | []>([]);
    const [sortBy, setSortBy] = useState<sortKey>("title");
    const [sortOrder, setSortOrder] = useState<sortOrder>("asc");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    
    const loadMovies = async () => {
        setError(null);
        try{
            setLoading(true);
            const movies = await fetchTopMovies();
            setMOVIES(movies);
        }catch(e){
            console.error("Failed to fetch movies", e);
            setError("Failed to load movies. Please try again later.");
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMovies();
    },[]);


    const filteredMovies = useMemo(() => {
        const q = normalize(deferredSearchTerm.trim());
        if(!q) return [];
        return MOVIES.filter(movie => normalize(movie.title).includes(q))
    },[deferredSearchTerm, MOVIES])


    const results = useMemo(() => {
        const isAsc = sortOrder === "asc";
        const q = normalize(deferredSearchTerm.trim());
        const startsRe = new RegExp("^" + esc(q)); // match from start
        const wordRe = new RegExp("\\b" + esc(q)); // match from word boundary

        const tieBreaker = (title: string) => {
            const t = normalize(title);
            if (startsRe.test(t)) return 0;   
            if (wordRe.test(t))   return 1;   
            return 2;                         
        };

        const SortedResults = [...filteredMovies].sort((movie1, movie2) => {   
            let c = 0;

            if (sortBy === "title") {
                const ta = tieBreaker(movie1.title);
                const tb = tieBreaker(movie2.title);
                if (ta !== tb) return ta - tb;

                c = movie1.title.localeCompare(movie2.title, undefined, { sensitivity: "base" });
                
            }else{ // sortBy "rank"
                c = movie1.vote_average - movie2.vote_average;
            }

            return isAsc ? c : -c;
        });

        return SortedResults
    }, [filteredMovies, sortBy, sortOrder, deferredSearchTerm]);

    // removes duplicates from results
    const uniqueResults = useMemo(() => {
        const seen = new Set<number>();
        const out: tmdbMovie[] = [];
        for (const m of results) {
            if (!seen.has(m.id)) {
                seen.add(m.id);
                out.push(m);
            }
        }
        return out;
    }, [results]);


    return (
    <div className={styles.main}>

        <div className={styles.searchContainer}>
            <input 
                type="search" 
                name="search" 
                className={styles.searchBar} 
                placeholder="Search for movie name..." 
                value = {searchTerm}
                onChange = {(e) => setSearchTerm(e.target.value)}
                aria-label="Search movies"
            />
        
            <div className={styles.movieList}>
                {loading ? (
                    <div className={styles.noResults} aria-busy="true">Loading movies…</div>
                ) : error ? (
                    <div className={styles.noResults}>
                        <div>{error}</div>
                        <button onClick={loadMovies} className={styles.retryButton}>Retry</button>
                    </div>
                ) : searchTerm ? (
                    uniqueResults.length > 0 ? (
                        uniqueResults.map(movie => (
                            <div key={movie.id} 
                                className={styles.movieItem}
                                onClick={() => navigate(`/details/${movie.id}`)}
                                 >
                                <div className={styles.movieTitle}>{movie.title}</div>
                                <div className={styles.movieDetails}>
                                    Rank: {movie.vote_average} • Year: {movie.release_date?.slice(0,4) ?? '—'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            No movies found matching "{searchTerm}"
                        </div>
                    )
                ) : (
                    <div className={styles.noResults}>
                        No results found
                    </div>
                )}
            </div>
        </div>

        <div className={styles.controlsContainer}>
            
            <div className={styles.sortDropdown}>
                <select 
                    name="sort" 
                    id="sort" 
                    className={styles.sortSelect}
                    value = {sortBy}
                    onChange = {(e) => setSortBy(e.target.value as sortKey)}
                >
                    
                    <option value="title">Sort by Title</option>
                    <option value="rank">Sort by Rank</option>
                </select>
            </div>

            <div className={styles.orderRadio} role="radiogroup" aria-label="Sort order">
                
                    <input 
                        type="radio" 
                        name="order" 
                        id="asc" 
                        className={styles.viewRadio} 
                        value = "asc"
                        checked = {sortOrder === "asc"}
                        onChange = {(e) => setSortOrder(e.target.value as sortOrder)}
                    />
                    <label htmlFor="asc">Ascending</label>

                
                    <input 
                        type="radio" 
                        name="order" 
                        id="desc" 
                        className={styles.viewRadio} 
                        value = "desc"
                        checked = {sortOrder === "desc"}
                        onChange = {(e) => setSortOrder(e.target.value as sortOrder)}
                    />
                    <label htmlFor="desc">Descending</label>
                

            </div>
        </div>

    </div>
    );
}

export default ListView;