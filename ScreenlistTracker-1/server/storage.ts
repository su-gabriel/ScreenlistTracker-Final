import { 
  User, 
  InsertUser, 
  StreamingService, 
  Genre, 
  TvShow, 
  UserPreference, 
  InsertUserPreference, 
  WatchHistoryEntry, 
  InsertWatchHistoryEntry, 
  WatchlistEntry, 
  InsertWatchlistEntry,
  PersonalityInsight 
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Streaming services
  getStreamingServices(): Promise<StreamingService[]>;
  getStreamingService(id: number): Promise<StreamingService | undefined>;
  
  // Genres
  getGenres(): Promise<Genre[]>;
  getGenre(id: number): Promise<Genre | undefined>;
  
  // TV Shows
  getTvShows(): Promise<TvShow[]>;
  getTvShow(id: number): Promise<TvShow | undefined>;
  getTvShowsByGenre(genreId: number): Promise<TvShow[]>;
  getTvShowsByStreamingService(serviceId: number): Promise<TvShow[]>;
  getPopularTvShows(limit?: number): Promise<TvShow[]>;
  
  // User preferences
  getUserPreferences(userId: number): Promise<UserPreference | undefined>;
  createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference>;
  updateUserPreferences(id: number, preferences: Partial<UserPreference>): Promise<UserPreference | undefined>;
  
  // Watch history
  getWatchHistory(userId: number): Promise<WatchHistoryEntry[]>;
  getWatchHistoryEntry(userId: number, showId: number): Promise<WatchHistoryEntry | undefined>;
  addToWatchHistory(entry: InsertWatchHistoryEntry): Promise<WatchHistoryEntry>;
  updateWatchHistory(id: number, entry: Partial<WatchHistoryEntry>): Promise<WatchHistoryEntry | undefined>;
  
  // Watchlist
  getWatchlist(userId: number): Promise<WatchlistEntry[]>;
  addToWatchlist(entry: InsertWatchlistEntry): Promise<WatchlistEntry>;
  removeFromWatchlist(userId: number, showId: number): Promise<boolean>;
  
  // Personality insights
  getPersonalityInsights(userId: number): Promise<PersonalityInsight | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private streamingServices: Map<number, StreamingService>;
  private genres: Map<number, Genre>;
  private tvShows: Map<number, TvShow>;
  private userPreferences: Map<number, UserPreference>;
  private watchHistory: Map<number, WatchHistoryEntry>;
  private watchlist: Map<number, WatchlistEntry>;
  private personalityInsights: Map<number, PersonalityInsight>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private userPrefId: number = 1;
  private watchHistoryId: number = 1;
  private watchlistId: number = 1;
  private personalityInsightId: number = 1;

  constructor() {
    this.users = new Map();
    this.streamingServices = new Map();
    this.genres = new Map();
    this.tvShows = new Map();
    this.userPreferences = new Map();
    this.watchHistory = new Map();
    this.watchlist = new Map();
    this.personalityInsights = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Initialize with streaming services data from the server/data/tvshows.ts
    // This will be done in the server initialization
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Streaming services methods
  async getStreamingServices(): Promise<StreamingService[]> {
    return Array.from(this.streamingServices.values());
  }
  
  async getStreamingService(id: number): Promise<StreamingService | undefined> {
    return this.streamingServices.get(id);
  }
  
  // Genres methods
  async getGenres(): Promise<Genre[]> {
    return Array.from(this.genres.values());
  }
  
  async getGenre(id: number): Promise<Genre | undefined> {
    return this.genres.get(id);
  }
  
  // TV Shows methods
  async getTvShows(): Promise<TvShow[]> {
    return Array.from(this.tvShows.values());
  }
  
  async getTvShow(id: number): Promise<TvShow | undefined> {
    return this.tvShows.get(id);
  }
  
  async getTvShowsByGenre(genreId: number): Promise<TvShow[]> {
    return Array.from(this.tvShows.values()).filter(
      (show) => show.genres && show.genres.includes(String(genreId))
    );
  }
  
  async getTvShowsByStreamingService(serviceId: number): Promise<TvShow[]> {
    return Array.from(this.tvShows.values()).filter(
      (show) => show.streamingServiceId === serviceId
    );
  }
  
  async getPopularTvShows(limit: number = 10): Promise<TvShow[]> {
    // In a real app, we would sort by popularity metrics
    return Array.from(this.tvShows.values()).slice(0, limit);
  }
  
  // User preferences methods
  async getUserPreferences(userId: number): Promise<UserPreference | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId
    );
  }
  
  async createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference> {
    const id = this.userPrefId++;
    const userPref: UserPreference = { ...preferences, id };
    this.userPreferences.set(id, userPref);
    return userPref;
  }
  
  async updateUserPreferences(id: number, preferences: Partial<UserPreference>): Promise<UserPreference | undefined> {
    const existing = this.userPreferences.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...preferences };
    this.userPreferences.set(id, updated);
    return updated;
  }
  
  // Watch history methods
  async getWatchHistory(userId: number): Promise<WatchHistoryEntry[]> {
    return Array.from(this.watchHistory.values()).filter(
      (entry) => entry.userId === userId
    );
  }
  
  async getWatchHistoryEntry(userId: number, showId: number): Promise<WatchHistoryEntry | undefined> {
    return Array.from(this.watchHistory.values()).find(
      (entry) => entry.userId === userId && entry.showId === showId
    );
  }
  
  async addToWatchHistory(entry: InsertWatchHistoryEntry): Promise<WatchHistoryEntry> {
    const id = this.watchHistoryId++;
    const historyEntry: WatchHistoryEntry = { 
      ...entry, 
      id, 
      lastWatched: new Date() 
    };
    this.watchHistory.set(id, historyEntry);
    return historyEntry;
  }
  
  async updateWatchHistory(id: number, entry: Partial<WatchHistoryEntry>): Promise<WatchHistoryEntry | undefined> {
    const existing = this.watchHistory.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...entry, lastWatched: new Date() };
    this.watchHistory.set(id, updated);
    return updated;
  }
  
  // Watchlist methods
  async getWatchlist(userId: number): Promise<WatchlistEntry[]> {
    return Array.from(this.watchlist.values()).filter(
      (entry) => entry.userId === userId
    );
  }
  
  async addToWatchlist(entry: InsertWatchlistEntry): Promise<WatchlistEntry> {
    // Check if already in watchlist
    const existing = Array.from(this.watchlist.values()).find(
      (item) => item.userId === entry.userId && item.showId === entry.showId
    );
    
    if (existing) return existing;
    
    const id = this.watchlistId++;
    const watchlistEntry: WatchlistEntry = { 
      ...entry, 
      id, 
      addedAt: new Date() 
    };
    this.watchlist.set(id, watchlistEntry);
    return watchlistEntry;
  }
  
  async removeFromWatchlist(userId: number, showId: number): Promise<boolean> {
    const entry = Array.from(this.watchlist.values()).find(
      (item) => item.userId === userId && item.showId === showId
    );
    
    if (!entry) return false;
    
    return this.watchlist.delete(entry.id);
  }
  
  // Personality insights methods
  async getPersonalityInsights(userId: number): Promise<PersonalityInsight | undefined> {
    return Array.from(this.personalityInsights.values()).find(
      (insight) => insight.userId === userId
    );
  }

  // Methods to populate the database with initial data
  populateStreamingServices(services: StreamingService[]) {
    services.forEach((service, index) => {
      this.streamingServices.set(service.id, service);
    });
  }
  
  populateGenres(genresList: Genre[]) {
    genresList.forEach((genre) => {
      this.genres.set(genre.id, genre);
    });
  }
  
  populateTvShows(shows: TvShow[]) {
    shows.forEach((show) => {
      this.tvShows.set(show.id, show);
    });
  }
}

export const storage = new MemStorage();
