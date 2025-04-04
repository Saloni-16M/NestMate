import { 
  users, type User, type InsertUser,
  roommatePreferences, type RoommatePreferences, type InsertRoommatePreferences,
  properties, type Property, type InsertProperty,
  matches, type Match, type InsertMatch,
  propertyInterests, type PropertyInterest, type InsertPropertyInterest,
  messages, type Message, type InsertMessage
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Roommate preferences methods
  getRoommatePreferences(userId: number): Promise<RoommatePreferences | undefined>;
  createRoommatePreferences(preferences: InsertRoommatePreferences): Promise<RoommatePreferences>;
  updateRoommatePreferences(userId: number, preferences: Partial<InsertRoommatePreferences>): Promise<RoommatePreferences | undefined>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Match methods
  getMatch(id: number): Promise<Match | undefined>;
  getUserMatches(userId: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchStatus(id: number, status: string): Promise<Match | undefined>;
  
  // Property Interest methods
  getPropertyInterestsByUser(userId: number): Promise<PropertyInterest[]>;
  getPropertyInterestsByProperty(propertyId: number): Promise<PropertyInterest[]>;
  createPropertyInterest(interest: InsertPropertyInterest): Promise<PropertyInterest>;
  updatePropertyInterestStatus(id: number, status: string): Promise<PropertyInterest | undefined>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getUserMessages(userId: number): Promise<Message[]>;
  getConversation(userId1: number, userId2: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private roommatePreferencesData: Map<number, RoommatePreferences>;
  private propertiesData: Map<number, Property>;
  private matchesData: Map<number, Match>;
  private propertyInterestsData: Map<number, PropertyInterest>;
  private messagesData: Map<number, Message>;
  
  private userCurrentId: number = 1;
  private roommatePreferencesCurrentId: number = 1;
  private propertyCurrentId: number = 1;
  private matchCurrentId: number = 1;
  private propertyInterestCurrentId: number = 1;
  private messageCurrentId: number = 1;
  
  public sessionStore: session.Store;

  constructor() {
    this.usersData = new Map();
    this.roommatePreferencesData = new Map();
    this.propertiesData = new Map();
    this.matchesData = new Map();
    this.propertyInterestsData = new Map();
    this.messagesData = new Map();
    
    // Initialize the session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      dateJoined: now 
    };
    this.usersData.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  // Roommate preferences methods
  async getRoommatePreferences(userId: number): Promise<RoommatePreferences | undefined> {
    return Array.from(this.roommatePreferencesData.values()).find(
      (pref) => pref.userId === userId
    );
  }

  async createRoommatePreferences(preferences: InsertRoommatePreferences): Promise<RoommatePreferences> {
    const id = this.roommatePreferencesCurrentId++;
    const roommatePreferences: RoommatePreferences = {
      ...preferences,
      id,
      hashedPreferences: this.generateHashedPreferences(preferences)
    };
    this.roommatePreferencesData.set(id, roommatePreferences);
    return roommatePreferences;
  }

  async updateRoommatePreferences(userId: number, updateData: Partial<InsertRoommatePreferences>): Promise<RoommatePreferences | undefined> {
    const preferences = Array.from(this.roommatePreferencesData.values()).find(
      (pref) => pref.userId === userId
    );
    if (!preferences) return undefined;
    
    const updatedPreferences = { 
      ...preferences, 
      ...updateData,
      hashedPreferences: this.generateHashedPreferences({ ...preferences, ...updateData })
    };
    this.roommatePreferencesData.set(preferences.id, updatedPreferences);
    return updatedPreferences;
  }

  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.propertiesData.get(id);
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.propertiesData.values());
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return Array.from(this.propertiesData.values()).filter(
      (property) => property.ownerId === ownerId
    );
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const now = new Date();
    const newProperty: Property = {
      ...property,
      id,
      datePosted: now
    };
    this.propertiesData.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.propertiesData.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updateData };
    this.propertiesData.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.propertiesData.delete(id);
  }

  // Match methods
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matchesData.get(id);
  }

  async getUserMatches(userId: number): Promise<Match[]> {
    return Array.from(this.matchesData.values()).filter(
      (match) => match.userId1 === userId || match.userId2 === userId
    );
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchCurrentId++;
    const now = new Date();
    const newMatch: Match = {
      ...match,
      id,
      dateMatched: now
    };
    this.matchesData.set(id, newMatch);
    return newMatch;
  }

  async updateMatchStatus(id: number, status: string): Promise<Match | undefined> {
    const match = this.matchesData.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, status };
    this.matchesData.set(id, updatedMatch);
    return updatedMatch;
  }

  // Property Interest methods
  async getPropertyInterestsByUser(userId: number): Promise<PropertyInterest[]> {
    return Array.from(this.propertyInterestsData.values()).filter(
      (interest) => interest.userId === userId
    );
  }

  async getPropertyInterestsByProperty(propertyId: number): Promise<PropertyInterest[]> {
    return Array.from(this.propertyInterestsData.values()).filter(
      (interest) => interest.propertyId === propertyId
    );
  }

  async createPropertyInterest(interest: InsertPropertyInterest): Promise<PropertyInterest> {
    const id = this.propertyInterestCurrentId++;
    const now = new Date();
    const newInterest: PropertyInterest = {
      ...interest,
      id,
      dateInterested: now
    };
    this.propertyInterestsData.set(id, newInterest);
    return newInterest;
  }

  async updatePropertyInterestStatus(id: number, status: string): Promise<PropertyInterest | undefined> {
    const interest = this.propertyInterestsData.get(id);
    if (!interest) return undefined;
    
    const updatedInterest = { ...interest, status };
    this.propertyInterestsData.set(id, updatedInterest);
    return updatedInterest;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesData.get(id);
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messagesData.values()).filter(
      (message) => message.senderId === userId || message.recipientId === userId
    );
  }

  async getConversation(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messagesData.values()).filter(
      (message) => 
        (message.senderId === userId1 && message.recipientId === userId2) ||
        (message.senderId === userId2 && message.recipientId === userId1)
    ).sort((a, b) => a.dateSent.getTime() - b.dateSent.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const newMessage: Message = {
      ...message,
      id,
      dateSent: now
    };
    this.messagesData.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messagesData.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.messagesData.set(id, updatedMessage);
    return updatedMessage;
  }

  // Helper methods
  private generateHashedPreferences(preferences: Partial<InsertRoommatePreferences>): string {
    // A simple string that combines key preferences for faster matching
    const prefsArr = [
      preferences.cleanlinessLevel,
      preferences.noiseLevel,
      preferences.sleepSchedule,
      preferences.smokingPreferences,
      preferences.petsPreferences
    ];
    return prefsArr.join('-');
  }
}

export const storage = new MemStorage();
