import { StreamingService, Genre, TvShow } from "@shared/schema";
import { storage } from "../storage";
import { 
  fetchGenres, 
  fetchStreamingServices, 
  fetchPopularTvShows
} from '../services/tmdb';

// Fallback streaming services data in case API fails
export const streamingServicesFallback: StreamingService[] = [
  { id: 1, name: "Netflix", icon: "netflix", color: "#E50914" },
  { id: 2, name: "Hulu", icon: "hulu", color: "#1CE783" },
  { id: 3, name: "Disney+", icon: "disney", color: "#113CCF" },
  { id: 4, name: "Amazon Prime", icon: "amazon", color: "#00A8E1" },
  { id: 5, name: "HBO Max", icon: "hbo", color: "#741FAA" },
  { id: 6, name: "Apple TV+", icon: "apple", color: "#000000" }
];

// Fallback genres data in case API fails
export const genresFallback: Genre[] = [
  { id: 1, name: "Drama" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Sci-Fi" },
  { id: 4, name: "Thriller" },
  { id: 5, name: "Action" },
  { id: 6, name: "Crime" },
  { id: 7, name: "Fantasy" },
  { id: 8, name: "Horror" },
  { id: 9, name: "Romance" },
  { id: 10, name: "Documentary" }
];

// Fallback TV shows data in case API fails
export const tvShowsFallback: TvShow[] = [
  {
    id: 1,
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    year: "2008-2013",
    seasons: 5,
    imageUrl: "https://via.placeholder.com/300x200?text=Breaking+Bad",
    streamingServiceId: 1,
    rating: 49,
    genres: ["1", "6"]
  },
  {
    id: 2,
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    year: "2016-Present",
    seasons: 4,
    imageUrl: "https://via.placeholder.com/300x200?text=Stranger+Things",
    streamingServiceId: 1,
    rating: 48,
    genres: ["3", "7", "8"]
  },
  {
    id: 3,
    title: "The Office",
    description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    year: "2005-2013",
    seasons: 9,
    imageUrl: "https://via.placeholder.com/300x200?text=The+Office",
    streamingServiceId: 2,
    rating: 45,
    genres: ["2"]
  }
];

// Function to initialize the database with data from TMDB API
// If API calls fail, fallback to sample data
export async function initializeTvData() {
  try {
    console.log('Initializing TV data from TMDB API...');
    
    // Fetch and populate streaming services
    let streamingServices: StreamingService[];
    try {
      streamingServices = await fetchStreamingServices();
      console.log(`Fetched ${streamingServices.length} streaming services from TMDB API`);
    } catch (error) {
      console.error('Failed to fetch streaming services from TMDB API, using fallback data:', error);
      streamingServices = streamingServicesFallback;
    }
    storage.populateStreamingServices(streamingServices);
    
    // Fetch and populate genres
    let genres: Genre[];
    try {
      genres = await fetchGenres();
      console.log(`Fetched ${genres.length} genres from TMDB API`);
    } catch (error) {
      console.error('Failed to fetch genres from TMDB API, using fallback data:', error);
      genres = genresFallback;
    }
    storage.populateGenres(genres);
    
    // Fetch and populate TV shows
    let shows: TvShow[];
    try {
      shows = await fetchPopularTvShows(1, 20);
      console.log(`Fetched ${shows.length} popular TV shows from TMDB API`);
    } catch (error) {
      console.error('Failed to fetch TV shows from TMDB API, using fallback data:', error);
      shows = tvShowsFallback;
    }
    storage.populateTvShows(shows);
    
    console.log('TV data initialization complete');
  } catch (error) {
    console.error('Error initializing TV data:', error);
    // Use fallback data if any part of the initialization process fails
    storage.populateStreamingServices(streamingServicesFallback);
    storage.populateGenres(genresFallback);
    storage.populateTvShows(tvShowsFallback);
  }
}
