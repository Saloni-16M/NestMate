import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertRoommatePreferencesSchema, 
  insertPropertySchema, 
  insertMatchSchema, 
  insertPropertyInterestSchema, 
  insertMessageSchema 
} from "@shared/schema";
import { setupAuth } from "./auth";

// Auth middleware for session-based authentication
import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup auth routes (register, login, logout, user)
  setupAuth(app);

  // Roommate preferences routes
  app.post("/api/roommate-preferences", auth, async (req: Request, res: Response) => {
    try {
      const validatedData = insertRoommatePreferencesSchema.parse({
        ...req.body,
        userId: (req.user as Express.User).id
      });
      
      // Check if preferences already exist
      const existingPreferences = await storage.getRoommatePreferences((req.user as Express.User).id);
      if (existingPreferences) {
        return res.status(400).json({ message: "Preferences already exist" });
      }
      
      const preferences = await storage.createRoommatePreferences(validatedData);
      res.json(preferences);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/roommate-preferences", auth, async (req: Request, res: Response) => {
    try {
      const preferences = await storage.getRoommatePreferences((req.user as Express.User).id);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.json(preferences);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/roommate-preferences", auth, async (req: Request, res: Response) => {
    try {
      // Validate the data excluding userId (which can't be changed)
      const { userId, ...updateData } = req.body;
      
      // Update preferences
      const preferences = await storage.updateRoommatePreferences((req.user as Express.User).id, updateData);
      if (!preferences) {
        return res.status(404).json({ message: "Preferences not found" });
      }
      
      res.json(preferences);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Property routes
  app.post("/api/properties", auth, async (req: any, res) => {
    try {
      const validatedData = insertPropertySchema.parse({
        ...req.body,
        ownerId: req.user.id
      });
      
      const property = await storage.createProperty(validatedData);
      res.json(property);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(parseInt(req.params.id));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/properties/owner", auth, async (req: any, res) => {
    try {
      const properties = await storage.getPropertiesByOwner(req.user.id);
      res.json(properties);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/properties/:id", auth, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      
      // Check if property exists and user is the owner
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // Validate and update data
      const { ownerId, ...updateData } = req.body;
      const updatedProperty = await storage.updateProperty(propertyId, updateData);
      
      res.json(updatedProperty);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/properties/:id", auth, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      
      // Check if property exists and user is the owner
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      if (property.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const deleted = await storage.deleteProperty(propertyId);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete property" });
      }
      
      res.json({ message: "Property deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Match routes
  app.get("/api/matches", auth, async (req: any, res) => {
    try {
      const matches = await storage.getUserMatches(req.user.id);
      
      // Add user info to matches
      const matchesWithUserInfo = await Promise.all(matches.map(async (match) => {
        const otherUserId = match.userId1 === req.user.id ? match.userId2 : match.userId1;
        const otherUser = await storage.getUser(otherUserId);
        
        if (!otherUser) return match;
        
        const { password, ...userWithoutPassword } = otherUser;
        return {
          ...match,
          otherUser: userWithoutPassword
        };
      }));
      
      res.json(matchesWithUserInfo);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/matches", auth, async (req: any, res) => {
    try {
      const { userId2, compatibilityScore } = req.body;
      
      if (!userId2 || !compatibilityScore) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if match already exists
      const existingMatches = await storage.getUserMatches(req.user.id);
      const alreadyMatched = existingMatches.find(m => 
        (m.userId1 === req.user.id && m.userId2 === userId2) || 
        (m.userId1 === userId2 && m.userId2 === req.user.id)
      );
      
      if (alreadyMatched) {
        return res.status(400).json({ message: "Match already exists" });
      }
      
      const match = await storage.createMatch({
        userId1: req.user.id,
        userId2,
        compatibilityScore,
        status: "pending"
      });
      
      res.json(match);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/matches/:id/status", auth, async (req: any, res) => {
    try {
      const matchId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Check if match exists and user is part of it
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      if (match.userId1 !== req.user.id && match.userId2 !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updatedMatch = await storage.updateMatchStatus(matchId, status);
      res.json(updatedMatch);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Property interest routes
  app.post("/api/property-interests", auth, async (req: any, res) => {
    try {
      const { propertyId, status } = req.body;
      
      if (!propertyId) {
        return res.status(400).json({ message: "Property ID is required" });
      }
      
      const interest = await storage.createPropertyInterest({
        userId: req.user.id,
        propertyId,
        status: status || "interested"
      });
      
      res.json(interest);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/property-interests", auth, async (req: any, res) => {
    try {
      const interests = await storage.getPropertyInterestsByUser(req.user.id);
      
      // Add property info to interests
      const interestsWithPropertyInfo = await Promise.all(interests.map(async (interest) => {
        const property = await storage.getProperty(interest.propertyId);
        return {
          ...interest,
          property
        };
      }));
      
      res.json(interestsWithPropertyInfo);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/property-interests/:id/status", auth, async (req: any, res) => {
    try {
      const interestId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const interest = await storage.updatePropertyInterestStatus(interestId, status);
      if (!interest) {
        return res.status(404).json({ message: "Interest not found" });
      }
      
      res.json(interest);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Message routes
  app.post("/api/messages", auth, async (req: any, res) => {
    try {
      const { recipientId, content } = req.body;
      
      if (!recipientId || !content) {
        return res.status(400).json({ message: "Recipient ID and content are required" });
      }
      
      const message = await storage.createMessage({
        senderId: req.user.id,
        recipientId,
        content,
        isRead: false
      });
      
      res.json(message);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/messages", auth, async (req: any, res) => {
    try {
      const messages = await storage.getUserMessages(req.user.id);
      
      // Group messages by conversation
      const conversations = messages.reduce((acc, message) => {
        const otherUserId = message.senderId === req.user.id ? message.recipientId : message.senderId;
        if (!acc[otherUserId]) {
          acc[otherUserId] = [];
        }
        acc[otherUserId].push(message);
        return acc;
      }, {} as Record<number, any[]>);
      
      // Sort conversations by latest message
      const sortedConversations = Object.entries(conversations).map(([otherUserId, messages]) => {
        // Sort messages by date
        const sortedMessages = messages.sort((a, b) => b.dateSent.getTime() - a.dateSent.getTime());
        return {
          otherUserId: parseInt(otherUserId),
          messages: sortedMessages,
          latestMessage: sortedMessages[0],
          unreadCount: sortedMessages.filter(m => m.recipientId === req.user.id && !m.isRead).length
        };
      }).sort((a, b) => b.latestMessage.dateSent.getTime() - a.latestMessage.dateSent.getTime());
      
      res.json(sortedConversations);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/messages/:userId", auth, async (req: any, res) => {
    try {
      const otherUserId = parseInt(req.params.userId);
      const conversation = await storage.getConversation(req.user.id, otherUserId);
      
      res.json(conversation);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/messages/:id/read", auth, async (req: any, res) => {
    try {
      const messageId = parseInt(req.params.id);
      
      // Check if message exists and user is the recipient
      const message = await storage.getMessage(messageId);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      if (message.recipientId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updatedMessage = await storage.markMessageAsRead(messageId);
      res.json(updatedMessage);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return httpServer;
}
