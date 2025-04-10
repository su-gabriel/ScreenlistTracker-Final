import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Streaming service schema
export const streamingServices = pgTable("streaming_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

// Genre schema
export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// TV shows schema
export const tvShows = pgTable("tv_shows", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  year: text("year"),
  seasons: integer("seasons"),
  imageUrl: text("image_url"),
  streamingServiceId: integer("streaming_service_id"),
  rating: integer("rating"),
  genres: text("genres").array(),
});

// User preferences schema
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  streamingServices: integer("streaming_services").array(),
  favoriteGenres: integer("favorite_genres").array(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  streamingServices: true,
  favoriteGenres: true,
});

// User watch history schema
export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  showId: integer("show_id").notNull(),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0),
  lastWatched: timestamp("last_watched").defaultNow(),
});

export const insertWatchHistorySchema = createInsertSchema(watchHistory).pick({
  userId: true,
  showId: true,
  completed: true,
  progress: true,
});

// User watchlist schema
export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  showId: integer("show_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertWatchlistSchema = createInsertSchema(watchlist).pick({
  userId: true,
  showId: true,
});

// Personality insights schema
export const personalityInsights = pgTable("personality_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  traits: jsonb("traits").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type StreamingService = typeof streamingServices.$inferSelect;
export type Genre = typeof genres.$inferSelect;
export type TvShow = typeof tvShows.$inferSelect;

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferencesSchema>;

export type WatchHistoryEntry = typeof watchHistory.$inferSelect;
export type InsertWatchHistoryEntry = z.infer<typeof insertWatchHistorySchema>;

export type WatchlistEntry = typeof watchlist.$inferSelect;
export type InsertWatchlistEntry = z.infer<typeof insertWatchlistSchema>;

export type PersonalityInsight = typeof personalityInsights.$inferSelect;
