import React from "react";
import { useState , useMemo, useDeferredValue } from "react";
import styles from '../styles/ListView.module.css';


const MOVIES = [
  { id: 1, title: "The Shawshank Redemption", rank: 9.3, year: 1994 },
  { id: 2, title: "The Godfather", rank: 9.2, year: 1972 },
  { id: 3, title: "The Dark Knight", rank: 9.0, year: 2008 },
];


function ListView() {
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const filteredMovies = useMemo(() => {
        const q = deferredSearchTerm.trim().toLowerCase();
        if(!q) return MOVIES;
        return MOVIES.filter(movie => movie.title.toLowerCase().includes(q))
    },[deferredSearchTerm])

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
                {searchTerm ? (
                    filteredMovies.length > 0 ? (
                        filteredMovies.map(movie => (
                            <div key={movie.id} className={styles.movieItem}>
                                <div className={styles.movieTitle}>{movie.title}</div>
                                <div className={styles.movieDetails}>
                                    Rank: {movie.rank} • Year: {movie.year}
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
                <select name="sort" id="sort" className={styles.sortSelect}>
                    {/* <option value="" disabled selected>Sort by...</option> */}
                    <option value="title" selected>Sort by Title</option>
                    <option value="rank">Sort by Rank</option>
                </select>
            </div>

            <div className={styles.orderRadio}>
                
                    <input 
                        type="radio" 
                        name="order" 
                        id="asc" 
                        className={styles.viewRadio} 
                        defaultChecked 
                    />
                    <label htmlFor="asc">Ascending</label>

                
                    <input 
                        type="radio" 
                        name="order" 
                        id="desc" 
                        className={styles.viewRadio} 
                    />
                    <label htmlFor="desc">Descending</label>
                

            </div>
        </div>

    </div>
    );
}

export default ListView;