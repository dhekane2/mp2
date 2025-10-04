import axios from 'axios';

const tmdb_client = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params:{
        language: 'en-US',
    },
    headers: { "Content-Type": "application/json;charset=utf-8" },
    timeout: 8000,

});

// add API key to each request
tmdb_client.interceptors.request.use((config) => {

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) throw new Error("API key is required");

  config.params = {...(config.params || {}), api_key: apiKey};
  return config;
});


// Retry logic for rate limiting and server errors
tmdb_client.interceptors.response.use(
  my_response => my_response,
  async (err) => {
    const status = err?.response?.status;
    if (status === 429 || (status >= 500 && status < 600)) {
      const delay = 600 + Math.floor(Math.random() * 400);
      await new Promise(res => setTimeout(res, delay));
      return tmdb_client.request(err.config);
    }
    return Promise.reject(err);
  }
);


export default tmdb_client;

export type tmdbMovie = {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;

    release_date: string;
    vote_average: number;
    popularity: number;
    vote_count: number;
}
