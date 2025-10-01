import React from "react";
import { useState , useMemo, useDeferredValue } from "react";
import styles from '../styles/ListView.module.css';

type Movie = {
    id: number;
    title: string;
    rank: number;
    year: number;
}

const MOVIES: Movie[] = [
  // Classics
  { id: 1,  title: "The Shawshank Redemption", rank: 9.3, year: 1994 },
  { id: 2,  title: "The Godfather",                       rank: 9.2, year: 1972 },
  { id: 3,  title: "The Dark Knight",                     rank: 9.0, year: 2008 },
  { id: 4,  title: "12 Angry Men",                        rank: 9.0, year: 1957 },
  { id: 5,  title: "A Angry Men sequel",                        rank: 9.1, year: 1957 },
  { id: 6,  title: "Schindler's List",                    rank: 8.9, year: 1993 },
  { id: 7,  title: "Pulp Fiction",                        rank: 8.9, year: 1994 },
  { id: 8,  title: "The Lord of the Rings: The Return of the King", rank: 8.9, year: 2003 },
  { id: 9,  title: "The Matrix",                          rank: 8.7, year: 1999 },
  { id: 10,  title: "One Flew Over the Cuckoo's Nest",     rank: 8.7, year: 1975 },

  // Popular modern
  { id: 11, title: "Inception",                           rank: 8.7, year: 2010 },
  { id: 12, title: "Interstellar",                        rank: 8.6, year: 2014 },
  { id: 13, title: "Parasite",                            rank: 8.6, year: 2019 },
  { id: 14, title: "Whiplash",                            rank: 8.5, year: 2014 },
  { id: 15, title: "The Prestige",                        rank: 8.5, year: 2006 },
  { id: 16, title: "Avengers: Endgame",                   rank: 8.4, year: 2019 },
  { id: 17, title: "Mad Max: Fury Road",                  rank: 8.1, year: 2015 },
  { id: 18, title: "The Batman",                          rank: 7.8, year: 2022 },

  // Animation (punctuation/diacritics)
  { id: 19, title: "Spirited Away",                       rank: 8.6, year: 2001 },
  { id: 20, title: "WALL·E",                              rank: 8.4, year: 2008 },
  { id: 21, title: "Coco",                                rank: 8.4, year: 2017 },
  { id: 22, title: "Up",                                  rank: 8.2, year: 2009 },
  { id: 23, title: "Spider-Man: Into the Spider-Verse",   rank: 8.4, year: 2018 },
  { id: 24, title: "The Lion King",                       rank: 8.5, year: 1994 },

  // Non-English / accents
  { id: 25, title: "Amélie",                              rank: 8.3, year: 2001 },
  { id: 26, title: "Léon: The Professional",              rank: 8.5, year: 1994 },
  { id: 27, title: "Oldboy",                              rank: 8.4, year: 2003 },
  { id: 28, title: "City of God",                         rank: 8.6, year: 2002 },
  { id: 29, title: "3 Idiots",                            rank: 8.4, year: 2009 },

  // Mixed cases / numbers / ties for stable sort testing
  { id: 30, title: "Se7en",                               rank: 8.6, year: 1995 },
  { id: 31, title: "Fight Club",                          rank: 8.8, year: 1999 },
  { id: 32, title: "Forrest Gump",                        rank: 8.8, year: 1994 },
  { id: 33, title: "A Beautiful Mind",                    rank: 8.2, year: 2001 },
  { id: 34, title: "Batman Begins",                       rank: 8.2, year: 2005 },
  { id: 35, title: "The Intouchables",                    rank: 8.5, year: 2011 },

  // Low-rank outlier to test extremes
  { id: 36, title: "Cats",                                rank: 2.7, year: 2019 },
];

type sortKey = "title" | "rank";
type sortOrder = "asc" | "desc";


function ListView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<sortKey>("title");
    const [sortOrder, setSortOrder] = useState<sortOrder>("asc");
    const deferredSearchTerm = useDeferredValue(searchTerm);


    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


    const filteredMovies = useMemo(() => {
        const q = normalize(deferredSearchTerm.trim());
        if(!q) return [];
        return MOVIES.filter(movie => normalize(movie.title).includes(q))
    },[deferredSearchTerm])


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
                c = movie1.rank - movie2.rank;
            }

            return isAsc ? c : -c;
        });

        return SortedResults
    }, [filteredMovies, sortBy, sortOrder, deferredSearchTerm]);

    



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
                    results.length > 0 ? (
                        results.map(movie => (
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