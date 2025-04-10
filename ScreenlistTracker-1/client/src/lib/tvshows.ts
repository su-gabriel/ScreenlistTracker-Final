import { StreamingService, Genre, TvShow, UserPreference, WatchHistoryEntry, WatchlistEntry, PersonalityInsight } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Streaming services
export async function getStreamingServices(): Promise<StreamingService[]> {
  const res = await apiRequest("GET", "/api/streaming-services");
  return await res.json();
}

// Genres
export async function getGenres(): Promise<Genre[]> {
  const res = await apiRequest("GET", "/api/genres");
  return await res.json();
}

// TV Shows
export async function getTvShows(): Promise<TvShow[]> {
  const res = await apiRequest("GET", "/api/shows");
  return await res.json();
}

export async function getTvShow(id: number): Promise<TvShow> {
  const res = await apiRequest("GET", `/api/shows/${id}`);
  return await res.json();
}

export async function getTvShowsByGenre(genreId: number): Promise<TvShow[]> {
  const res = await apiRequest("GET", `/api/shows/genre/${genreId}`);
  return await res.json();
}

export async function getTvShowsByStreamingService(serviceId: number): Promise<TvShow[]> {
  const res = await apiRequest("GET", `/api/shows/streaming/${serviceId}`);
  return await res.json();
}

export async function getPopularTvShows(limit: number = 10): Promise<TvShow[]> {
  const res = await apiRequest("GET", `/api/popular-shows?limit=${limit}`);
  return await res.json();
}

// User Preferences
export async function getUserPreferences(): Promise<UserPreference | null> {
  const res = await apiRequest("GET", "/api/user-preferences");
  return await res.json();
}

export async function saveUserPreferences(preferences: {
  streamingServices: number[];
  favoriteGenres: number[];
}): Promise<UserPreference> {
  const res = await apiRequest("POST", "/api/user-preferences", preferences);
  return await res.json();
}

// Watch History
export async function getWatchHistory(): Promise<WatchHistoryEntry[]> {
  const res = await apiRequest("GET", "/api/watch-history");
  return await res.json();
}

export async function updateWatchHistory(showId: number, progress: number, completed: boolean = false): Promise<WatchHistoryEntry> {
  const res = await apiRequest("POST", "/api/watch-history", {
    showId,
    progress,
    completed
  });
  return await res.json();
}

// Watchlist
export async function getWatchlist(): Promise<WatchlistEntry[]> {
  const res = await apiRequest("GET", "/api/watchlist");
  return await res.json();
}

export async function addToWatchlist(showId: number): Promise<WatchlistEntry> {
  const res = await apiRequest("POST", "/api/watchlist", { showId });
  return await res.json();
}

export async function removeFromWatchlist(showId: number): Promise<void> {
  await apiRequest("DELETE", `/api/watchlist/${showId}`);
}

// Personality Insights
export async function getPersonalityInsights(): Promise<PersonalityInsight> {
  const res = await apiRequest("GET", "/api/personality");
  return await res.json();
}

// Helper function to get the streaming service name from ID
export function getStreamingServiceName(services: StreamingService[], id?: number): string {
  if (!id) return "Unknown";
  const service = services.find(s => s.id === id);
  return service ? service.name : "Unknown";
}

// Helper function to get the streaming service color from ID
export function getStreamingServiceColor(services: StreamingService[], id?: number): string {
  if (!id) return "#888888";
  const service = services.find(s => s.id === id);
  return service ? service.color : "#888888";
}

// Helper function to get the genre names from IDs
export function getGenreNames(allGenres: Genre[], genreIds?: string[]): string[] {
  if (!genreIds) return [];
  return genreIds.map(id => {
    const genre = allGenres.find(g => g.id === parseInt(id));
    return genre ? genre.name : "Unknown";
  });
}
