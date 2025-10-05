import { tmdbMovie } from './tmdbClient';

const STORAGE_KEY = "movie_cache_v1";

export function readMoviesFromLS(): tmdbMovie[] {
    try {
        const cachedData = localStorage.getItem(STORAGE_KEY);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            if (parsed?.movieList && Array.isArray(parsed.movieList)) {
                return parsed.movieList as tmdbMovie[];
            }
        }
        return [];
    } catch (error) {
        console.error("Failed to read movies from localStorage", error);
        return [];
    }
}