import tmdb_client, {tmdbMovie} from "../tmdbClient";

const STORAGE_KEY = "movie_cache_v1";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type cacheStruct = {
    ts: number;
    movieList: tmdbMovie[];
}

function readCache(): tmdbMovie[] | null {
    
    //try to read 
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    // if found
    try{
        const parsed = JSON.parse(data) as cacheStruct;
        if (Date.now() - parsed.ts > TTL_MS) return null;
        return parsed.movieList;
    }
    catch {
        return null;
    }   
}

function writeCache(movies: tmdbMovie[]) {
    const data: cacheStruct = {
        ts: Date.now(),
        movieList: movies
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function deduplicate(the_movies: tmdbMovie[]): tmdbMovie[] {
    
    const seen = new Set<number>();
    const deduped: tmdbMovie[] = [];
    const dupIds: number[] = [];

    for (const m of the_movies) {
        if (seen.has(m.id)) {
            dupIds.push(m.id);
            continue;
        }
        seen.add(m.id);
        deduped.push(m);
    }

    if (dupIds.length > 0) {
        console.warn('fetchTopMovies: removed duplicate movie ids before caching');
    }
    return deduped;

}

export default async function fetchTopMovies(): Promise<tmdbMovie[]> {

    // read cache
    const cached = readCache();

    // if data already cached and valid, return it
    if (cached) return cached;

    // else fetch from API
    const target = 250;
    const moviePerPage = 20;
    const totalPages = Math.ceil(target / moviePerPage);
    let allMovies: tmdbMovie[] = [];

    for(let page = 1; page <= totalPages; page++){
        const { data } = await tmdb_client.get('/movie/top_rated', {
            params:{page: page}
        })

        allMovies.push(...(data.results as tmdbMovie[]));
        if(allMovies.length >= target) break;
    }

    const top250 = allMovies.slice(0, target);
   
    const deduped = deduplicate(top250);

    writeCache(deduped);
    return deduped;
    
}

