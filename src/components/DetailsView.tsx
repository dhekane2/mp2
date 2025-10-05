import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import tmdb_client, { TMDB_IMAGE_BASE } from '../utils/tmdbClient';
import styles from '../styles/DetailsView.module.css';
import { readMoviesFromLS } from '../utils/readMoviesFromLS';

type movieParams = {
    id: string;
}


export default function DetailsView() {
    const params = useParams<movieParams>();
    const navigate = useNavigate();
    const movie_id = Number(params.id);
    
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  

    const movies = readMoviesFromLS();
    const currentIndex = movies.findIndex(m => m.id === movie_id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < movies.length - 1;


    const fetchMovieDetails = async (movieId: number) => {
        try{
            setLoading(true);
            setError(null);
            const response = await tmdb_client.get(`/movie/${movieId}`);
            setMovieDetails(response.data);
        } catch (err) {
            setError('Failed to fetch movie details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (movie_id) {
            fetchMovieDetails(movie_id);
        }
    }, [movie_id]);

    const handlePrev = () => {
        if (hasPrev) {
            const prevMovie = movies[currentIndex - 1];
            navigate(`/details/${prevMovie.id}`);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            const nextMovie = movies[currentIndex + 1];
            navigate(`/details/${nextMovie.id}`);
        }
    };

    const formatRuntime = (minutes: number) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loading}>Loading movie details…</div>
            ) : error ? (
                <div className={styles.error}>
                    <div>{error}</div>
                    <button 
                        className={styles.retryButton}
                        onClick={() => fetchMovieDetails(movie_id)}
                    >
                        Retry
                    </button>
                </div>
            ) : movieDetails ? (
                <>
                    <div className={styles.card}>
                        <div className={styles.leftContent}>
                            <h1 className={styles.title}>{movieDetails.title}</h1>
                            
                            {movieDetails.tagline && (
                                <p className={styles.tagline}>"{movieDetails.tagline}"</p>
                            )}
                            
                            <div className={styles.metaInfo}>
                                <div className={styles.rating}>
                                    ⭐ <span className={styles.ratingValue}>{movieDetails.vote_average?.toFixed(1) || 'N/A'}</span>
                                </div>
                                
                                <div className={styles.runtime}>
                                    {formatRuntime(movieDetails.runtime)}
                                </div>
                                
                                <div className={styles.releaseDate}>
                                    {formatDate(movieDetails.release_date)}
                                </div>
                            </div>
                            
                            {movieDetails.genres && movieDetails.genres.length > 0 && (
                                <div className={styles.genres}>
                                    {movieDetails.genres.map((genre: any) => (
                                        <span key={genre.id} className={styles.genreTag}>
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            {movieDetails.overview && (
                                <p className={styles.overview}>{movieDetails.overview}</p>
                            )}
                            
                            <div className={styles.navigation}>
                                <button 
                                    className={styles.navButton}
                                    onClick={handlePrev}
                                    disabled={!hasPrev}
                                >
                                    ← PREV
                                </button>
                                <button 
                                    className={styles.navButton}
                                    onClick={handleNext}
                                    disabled={!hasNext}
                                >
                                    NEXT →
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.rightContent}>
                            {movieDetails.poster_path ? (
                                <img
                                    src={`${TMDB_IMAGE_BASE}/w500${movieDetails.poster_path}`}
                                    alt={movieDetails.title}
                                    className={styles.poster}
                                />
                            ) : (
                                <div className={styles.noPoster}>No Image</div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.loading}>No movie found</div>
            )}
        </div>
    );
}
