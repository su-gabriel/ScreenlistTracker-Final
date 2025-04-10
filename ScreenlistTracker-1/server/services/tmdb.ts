import axios from 'axios';
import { TvShow, Genre, StreamingService } from '@shared/schema';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Map TMDB genres to our schema format
export async function fetchGenres(): Promise<Genre[]> {
  try {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data.genres.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
    }));
  } catch (error) {
    console.error('Error fetching genres from TMDB:', error);
    throw new Error('Failed to fetch genres');
  }
}

// Get popular TV shows from TMDB
export async function fetchPopularTvShows(page: number = 1, limit: number = 20): Promise<TvShow[]> {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: {
        page,
      },
    });
    
    return response.data.results.slice(0, limit).map((show: any) => mapTvShowFromTMDB(show));
  } catch (error) {
    console.error('Error fetching popular TV shows from TMDB:', error);
    throw new Error('Failed to fetch popular TV shows');
  }
}

// Get TV show details from TMDB by ID
export async function fetchTvShowDetails(id: number): Promise<TvShow> {
  try {
    const response = await tmdbApi.get(`/tv/${id}`, {
      params: {
        append_to_response: 'watch/providers',
      },
    });
    
    return mapTvShowFromTMDB(response.data, true);
  } catch (error) {
    console.error(`Error fetching TV show details for ID ${id} from TMDB:`, error);
    throw new Error(`Failed to fetch TV show with ID ${id}`);
  }
}

// Search TV shows on TMDB
export async function searchTvShows(query: string, page: number = 1): Promise<TvShow[]> {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: {
        query,
        page,
      },
    });
    
    return response.data.results.map((show: any) => mapTvShowFromTMDB(show));
  } catch (error) {
    console.error(`Error searching TV shows with query "${query}" on TMDB:`, error);
    throw new Error('Failed to search TV shows');
  }
}

// Get TV shows from a specific genre
export async function fetchTvShowsByGenre(genreId: number, page: number = 1): Promise<TvShow[]> {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: {
        with_genres: genreId,
        page,
      },
    });
    
    return response.data.results.map((show: any) => mapTvShowFromTMDB(show));
  } catch (error) {
    console.error(`Error fetching TV shows for genre ID ${genreId} from TMDB:`, error);
    throw new Error(`Failed to fetch TV shows for genre ID ${genreId}`);
  }
}

// This is a simplified version - TMDB doesn't have a direct API for streaming services
// We'll use a predefined list of common streaming services and map to provider IDs from TMDB
export async function fetchStreamingServices(): Promise<StreamingService[]> {
  // Common streaming services with their TMDB provider IDs
  return [
    { id: 8, name: 'Netflix', icon: 'netflix', color: '#E50914' },
    { id: 9, name: 'Amazon Prime', icon: 'amazon', color: '#00A8E1' },
    { id: 337, name: 'Disney+', icon: 'disney', color: '#113CCF' },
    { id: 350, name: 'Apple TV+', icon: 'apple', color: '#000000' },
    { id: 384, name: 'HBO Max', icon: 'hbo', color: '#5822B4' },
    { id: 15, name: 'Hulu', icon: 'hulu', color: '#1CE783' },
    { id: 531, name: 'Paramount+', icon: 'paramount', color: '#0064FF' },
    { id: 283, name: 'Crunchyroll', icon: 'crunchyroll', color: '#F47521' },
  ];
}

// Helper function to get shows by streaming service
export async function fetchTvShowsByStreamingService(serviceId: number, page: number = 1): Promise<TvShow[]> {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: {
        with_watch_providers: serviceId,
        watch_region: 'US', // Default to US region
        page,
      },
    });
    
    return response.data.results.map((show: any) => mapTvShowFromTMDB(show));
  } catch (error) {
    console.error(`Error fetching TV shows for provider ID ${serviceId} from TMDB:`, error);
    throw new Error(`Failed to fetch TV shows for provider ID ${serviceId}`);
  }
}

// Helper functions to map TMDB data to our schema
function mapTvShowFromTMDB(tmdbShow: any, includeDetails: boolean = false): TvShow {
  // Get streaming service ID if available (from watch/providers data)
  let streamingServiceId: number | null = null;
  if (tmdbShow['watch/providers']?.results?.US?.flatrate && tmdbShow['watch/providers'].results.US.flatrate.length > 0) {
    streamingServiceId = tmdbShow['watch/providers'].results.US.flatrate[0].provider_id;
  }
  
  // Map genre IDs to strings as required by our schema
  const genreIds = tmdbShow.genre_ids 
    ? tmdbShow.genre_ids.map((id: number) => id.toString()) 
    : (tmdbShow.genres ? tmdbShow.genres.map((g: any) => g.id.toString()) : []);
  
  // Extract year from first air date
  const year = tmdbShow.first_air_date 
    ? `${tmdbShow.first_air_date.substring(0, 4)}${tmdbShow.status === 'Ended' ? `-${tmdbShow.last_air_date?.substring(0, 4) || '?'}` : ''}`
    : null;
  
  return {
    id: tmdbShow.id,
    title: tmdbShow.name,
    description: tmdbShow.overview || null,
    year: year,
    seasons: includeDetails ? tmdbShow.number_of_seasons || null : null,
    imageUrl: tmdbShow.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbShow.poster_path}` : null,
    streamingServiceId: streamingServiceId,
    rating: Math.round(tmdbShow.vote_average * 5) || null, // Convert 10-point scale to 50-point scale (10 × 5)
    genres: genreIds,
  };
}

// Helper function to assign colors to genres (not used directly in genre mapping anymore)
function getGenreColor(genreName: string): string {
  const colorMap: Record<string, string> = {
    'Action & Adventure': '#FF5252',
    'Animation': '#FF9800',
    'Comedy': '#FFEB3B',
    'Crime': '#607D8B',
    'Documentary': '#8BC34A',
    'Drama': '#9C27B0',
    'Family': '#4CAF50',
    'Kids': '#03A9F4',
    'Mystery': '#3F51B5',
    'News': '#795548',
    'Reality': '#FFC107',
    'Sci-Fi & Fantasy': '#673AB7',
    'Soap': '#E91E63',
    'Talk': '#009688',
    'War & Politics': '#F44336',
    'Western': '#8D6E63',
  };
  
  return colorMap[genreName] || '#757575'; // Default gray
}