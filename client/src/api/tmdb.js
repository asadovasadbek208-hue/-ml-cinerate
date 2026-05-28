import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

const tmdb = axios.create({ baseURL: BASE_URL });

export const searchTMDB = async (query) => {
  const res = await tmdb.get('/search/multi', {
    params: { api_key: TMDB_API_KEY, query, language: 'uz-UZ,en-US', include_adult: false },
  });
  return res.data.results.filter(r => ['movie', 'tv'].includes(r.media_type));
};

export const getTMDBMovie = async (id, type) => {
  const res = await tmdb.get(`/${type}/${id}`, {
    params: { api_key: TMDB_API_KEY, language: 'en-US', append_to_response: 'credits,videos' },
  });
  return res.data;
};

export const getTMDBType = (mediaType, genres) => {
  if (mediaType === 'movie') return 'MOVIE';
  // TV shows - guess type from genres
  const genreNames = (genres || []).map(g => g.name?.toLowerCase() || '');
  if (genreNames.some(g => g.includes('animation'))) return 'ANIME';
  if (genreNames.some(g => g.includes('drama') && genreNames.includes('korean'))) return 'DRAMA';
  return 'SERIES';
};
