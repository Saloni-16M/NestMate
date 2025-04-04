import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull().default("renter"), // 'renter', 'landlord', 'both'
  profileImage: text("profile_image"),
  bio: text("bio"),
  phoneNumber: text("phone_number"),
  dateJoined: timestamp("date_joined").defaultNow()
});

export const roommatePreferences = pgTable("roommate_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cleanlinessLevel: integer("cleanliness_level"), // 1-5
  noiseLevel: integer("noise_level"), // 1-5
  hashedPreferences: text("hashed_preferences"), // For quick matching
  sleepSchedule: text("sleep_schedule"), // early_bird, night_owl, flexible
  dietPreferences: text("diet_preferences"), // vegan, vegetarian, no_restrictions, etc.
  smokingPreferences: text("smoking_preferences"), // yes, no, outdoors_only
  petsPreferences: text("pets_preferences"), // yes, no, depends
  guestPreferences: text("guest_preferences"), // often, sometimes, rarely
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  interests: jsonb("interests"), // Array of interests for matching
  additionalNotes: text("additional_notes")
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  areaSqFt: integer("area_sq_ft").notNull(),
  propertyType: text("property_type").notNull(), // apartment, house, townhouse, etc.
  isAvailable: boolean("is_available").notNull().default(true),
  availableFrom: timestamp("available_from"),
  amenities: jsonb("amenities"), // Array of amenities
  images: jsonb("images"), // Array of image URLs
  datePosted: timestamp("date_posted").defaultNow()
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  userId1: integer("user_id_1").notNull().references(() => users.id),
  userId2: integer("user_id_2").notNull().references(() => users.id),
  compatibilityScore: integer("compatibility_score").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  dateMatched: timestamp("date_matched").defaultNow()
});

export const propertyInterests = pgTable("property_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  status: text("status").notNull().default("interested"), // interested, viewed, applied, etc.
  dateInterested: timestamp("date_interested").defaultNow()
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  dateSent: timestamp("date_sent").defaultNow()
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
  userType: true,
  profileImage: true,
  bio: true,
  phoneNumber: true
});

export const insertRoommatePreferencesSchema = createInsertSchema(roommatePreferences).pick({
  userId: true,
  cleanlinessLevel: true,
  noiseLevel: true,
  sleepSchedule: true,
  dietPreferences: true,
  smokingPreferences: true,
  petsPreferences: true,
  guestPreferences: true,
  ageRangeMin: true,
  ageRangeMax: true,
  interests: true,
  additionalNotes: true
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  ownerId: true,
  title: true,
  description: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  price: true,
  bedrooms: true,
  bathrooms: true,
  areaSqFt: true,
  propertyType: true,
  isAvailable: true,
  availableFrom: true,
  amenities: true,
  images: true
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  userId1: true,
  userId2: true,
  compatibilityScore: true,
  status: true
});

export const insertPropertyInterestSchema = createInsertSchema(propertyInterests).pick({
  userId: true,
  propertyId: true,
  status: true
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  recipientId: true,
  content: true,
  isRead: true
});

// Types for inserts
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRoommatePreferences = z.infer<typeof insertRoommatePreferencesSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type InsertPropertyInterest = z.infer<typeof insertPropertyInterestSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Types for selects
export type User = typeof users.$inferSelect;
export type RoommatePreferences = typeof roommatePreferences.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type PropertyInterest = typeof propertyInterests.$inferSelect;
export type Message = typeof messages.$inferSelect;
