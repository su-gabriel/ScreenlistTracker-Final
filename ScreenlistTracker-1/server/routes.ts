import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { initializeTvData } from "./data/tvshows";
import { InsertUserPreference, InsertWatchHistoryEntry, InsertWatchlistEntry } from "@shared/schema";
import * as tmdbService from './services/tmdb';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize data from TMDB API or fallback to sample data
  await initializeTvData();
  
  // Set up authentication routes
  setupAuth(app);
  
  // Streaming services
  app.get("/api/streaming-services", async (req, res) => {
    try {
      // Try to get streaming services from TMDB API
      const services = await tmdbService.fetchStreamingServices();
      // Update our in-memory storage with latest data
      services.forEach(service => storage.populateStreamingServices([service]));
      res.json(services);
    } catch (error) {
      console.error('Error fetching streaming services from TMDB:', error);
      // Fallback to in-memory storage if TMDB API fails
      const services = await storage.getStreamingServices();
      res.json(services);
    }
  });
  
  // Genres
  app.get("/api/genres", async (req, res) => {
    try {
      // Try to get genres from TMDB API
      const genres = await tmdbService.fetchGenres();
      // Update our in-memory storage with latest data
      genres.forEach(genre => storage.populateGenres([genre]));
      res.json(genres);
    } catch (error) {
      console.error('Error fetching genres from TMDB:', error);
      // Fallback to in-memory storage if TMDB API fails
      const genres = await storage.getGenres();
      res.json(genres);
    }
  });
  
  // TV Shows
  app.get("/api/shows", async (req, res) => {
    try {
      // Get page parameter, default to 1
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      // Get TV shows from TMDB API - use popular shows as default
      const shows = await tmdbService.fetchPopularTvShows(page, 20);
      // Add to our in-memory store for caching
      shows.forEach(show => storage.populateTvShows([show]));
      res.json(shows);
    } catch (error) {
      console.error('Error fetching TV shows from TMDB:', error);
      // Fallback to in-memory storage if TMDB API fails
      const shows = await storage.getTvShows();
      res.json(shows);
    }
  });
  
  app.get("/api/shows/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      // Try to get show details from TMDB API
      const show = await tmdbService.fetchTvShowDetails(id);
      // Update our in-memory storage
      storage.populateTvShows([show]);
      res.json(show);
    } catch (error) {
      console.error(`Error fetching TV show with ID ${id} from TMDB:`, error);
      // Fallback to in-memory storage
      const show = await storage.getTvShow(id);
      if (!show) {
        return res.status(404).json({ message: "Show not found" });
      }
      res.json(show);
    }
  });
  
  app.get("/api/shows/genre/:genreId", async (req, res) => {
    const genreId = parseInt(req.params.genreId);
    try {
      // Get page parameter, default to 1
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      // Try to get shows by genre from TMDB API
      const shows = await tmdbService.fetchTvShowsByGenre(genreId, page);
      // Update our in-memory storage
      shows.forEach(show => storage.populateTvShows([show]));
      res.json(shows);
    } catch (error) {
      console.error(`Error fetching TV shows for genre ID ${genreId} from TMDB:`, error);
      // Fallback to in-memory storage
      const shows = await storage.getTvShowsByGenre(genreId);
      res.json(shows);
    }
  });
  
  app.get("/api/shows/streaming/:serviceId", async (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    try {
      // Get page parameter, default to 1
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      // Try to get shows by streaming service from TMDB API
      const shows = await tmdbService.fetchTvShowsByStreamingService(serviceId, page);
      // Update our in-memory storage
      shows.forEach(show => storage.populateTvShows([show]));
      res.json(shows);
    } catch (error) {
      console.error(`Error fetching TV shows for streaming service ID ${serviceId} from TMDB:`, error);
      // Fallback to in-memory storage
      const shows = await storage.getTvShowsByStreamingService(serviceId);
      res.json(shows);
    }
  });
  
  app.get("/api/popular-shows", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    try {
      // Try to get popular shows from TMDB API
      const shows = await tmdbService.fetchPopularTvShows(1, limit);
      // Update our in-memory storage
      shows.forEach(show => storage.populateTvShows([show]));
      res.json(shows);
    } catch (error) {
      console.error('Error fetching popular TV shows from TMDB:', error);
      // Fallback to in-memory storage
      const shows = await storage.getPopularTvShows(limit);
      res.json(shows);
    }
  });
  
  // Add search endpoint for TV shows
  app.get("/api/search-shows", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }
    
    try {
      // Get page parameter, default to 1
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      // Search TV shows using TMDB API
      const shows = await tmdbService.searchTvShows(query, page);
      // Update our in-memory storage
      shows.forEach(show => storage.populateTvShows([show]));
      res.json(shows);
    } catch (error) {
      console.error(`Error searching TV shows with query "${query}" on TMDB:`, error);
      // Fallback - search in local storage (very basic implementation)
      const allShows = await storage.getTvShows();
      const filteredShows = allShows.filter(show => 
        show.title.toLowerCase().includes(query.toLowerCase()) || 
        (show.description && show.description.toLowerCase().includes(query.toLowerCase()))
      );
      res.json(filteredShows);
    }
  });
  
  // Protected routes - require authentication
  app.use("/api/user-preferences", ensureAuthenticated);
  app.use("/api/watch-history", ensureAuthenticated);
  app.use("/api/watchlist", ensureAuthenticated);
  app.use("/api/personality", ensureAuthenticated);
  
  // User preferences
  app.get("/api/user-preferences", async (req, res) => {
    const preferences = await storage.getUserPreferences(req.user!.id);
    res.json(preferences || null);
  });
  
  app.post("/api/user-preferences", async (req, res) => {
    const userPrefs: InsertUserPreference = {
      userId: req.user!.id,
      streamingServices: req.body.streamingServices,
      favoriteGenres: req.body.favoriteGenres
    };
    
    // Check if preferences already exist
    const existing = await storage.getUserPreferences(req.user!.id);
    
    if (existing) {
      const updated = await storage.updateUserPreferences(existing.id, userPrefs);
      return res.json(updated);
    }
    
    const preferences = await storage.createUserPreferences(userPrefs);
    res.status(201).json(preferences);
  });
  
  // Watch history
  app.get("/api/watch-history", async (req, res) => {
    const history = await storage.getWatchHistory(req.user!.id);
    res.json(history);
  });
  
  app.post("/api/watch-history", async (req, res) => {
    const entry: InsertWatchHistoryEntry = {
      userId: req.user!.id,
      showId: req.body.showId,
      progress: req.body.progress || 0,
      completed: req.body.completed || false
    };
    
    // Check if entry already exists
    const existing = await storage.getWatchHistoryEntry(req.user!.id, req.body.showId);
    
    if (existing) {
      const updated = await storage.updateWatchHistory(existing.id, entry);
      return res.json(updated);
    }
    
    const historyEntry = await storage.addToWatchHistory(entry);
    res.status(201).json(historyEntry);
  });
  
  app.patch("/api/watch-history/:id", async (req, res) => {
    const updated = await storage.updateWatchHistory(parseInt(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: "Watch history entry not found" });
    }
    res.json(updated);
  });
  
  // Watchlist
  app.get("/api/watchlist", async (req, res) => {
    const watchlist = await storage.getWatchlist(req.user!.id);
    res.json(watchlist);
  });
  
  app.post("/api/watchlist", async (req, res) => {
    const entry: InsertWatchlistEntry = {
      userId: req.user!.id,
      showId: req.body.showId
    };
    
    const watchlistEntry = await storage.addToWatchlist(entry);
    res.status(201).json(watchlistEntry);
  });
  
  app.delete("/api/watchlist/:showId", async (req, res) => {
    const success = await storage.removeFromWatchlist(req.user!.id, parseInt(req.params.showId));
    if (!success) {
      return res.status(404).json({ message: "Show not in watchlist" });
    }
    res.status(204).end();
  });
  
  // Personality insights
  app.get("/api/personality", async (req, res) => {
    const insights = await storage.getPersonalityInsights(req.user!.id);
    res.json(insights || {
      id: 0,
      userId: req.user!.id,
      traits: {
        favoriteGenres: [
          { name: "Drama", percentage: 42 },
          { name: "Sci-Fi", percentage: 28 },
          { name: "Comedy", percentage: 18 },
          { name: "Action", percentage: 12 }
        ],
        watchHabits: [
          { name: "Weekend Binger", description: "You watch 68% more on weekends" },
          { name: "Series Completionist", description: "You finish 78% of series you start" }
        ],
        characterTraits: [
          "Thoughtful & Analytical",
          "Character-driven",
          "Appreciation for complex narratives",
          "Emotionally intelligent"
        ],
        personalityType: "Complex Character Enthusiast"
      },
      generatedAt: new Date()
    });
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}

// Middleware to ensure user is authenticated
function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
