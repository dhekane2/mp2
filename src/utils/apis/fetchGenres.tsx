import tmdb_client, {tmdbGenre} from "../tmdbClient";

const GENRE_STORAGE_KEY = "genre_cache_v1";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
    

type genreCacheStruct = {
    ts: number;
    genreList: tmdbGenre[];
}

function readCache(): tmdbGenre[] | null {
    
    //try to read 
    const data = localStorage.getItem(GENRE_STORAGE_KEY);
    if (!data) return null;

    // if found
    try{
        const parsed = JSON.parse(data) as genreCacheStruct;
        if (Date.now() - parsed.ts > TTL_MS) return null;
        return parsed.genreList;
    }
    catch {
        return null;
    }   
}

function writeCache(genres: tmdbGenre[]) {
    const data: genreCacheStruct = {
        ts: Date.now(),
        genreList: genres
    };
    localStorage.setItem(GENRE_STORAGE_KEY, JSON.stringify(data));
}


export default async function fetchGenres(): Promise<tmdbGenre[]> {

    // read cache
    const cached = readCache();

    // if data already cached and valid, return it
    if (cached) return cached;

    // else fetch from API
    const { data } = await tmdb_client.get('/genre/movie/list');
    const genres = data.genres as tmdbGenre[];
    writeCache(genres);
    return genres;
    
}