const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const crypto = require('crypto');
const { storage } = require('./storage');

// Utility functions for password hashing and verification
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${hash}.${salt}`;
}

async function comparePasswords(supplied, stored) {
  const [hash, salt] = stored.split('.');
  const hashBuffer = Buffer.from(hash, 'hex');
  const suppliedBuffer = crypto.scryptSync(supplied, salt, 64);
  
  return crypto.timingSafeEqual(hashBuffer, suppliedBuffer);
}

function setupAuth(app) {
  const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'RoommateFinder2024Secret',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set('trust proxy', 1);
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post('/api/register', async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Create new user with hashed password
      const hashedPassword = hashPassword(req.body.password);
      const newUser = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Log the user in after registration
      req.login(newUser, (err) => {
        if (err) return next(err);
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'An error occurred during registration' });
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message || 'Authentication failed' });
      
      req.login(user, (err) => {
        if (err) return next(err);
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.sendStatus(200);
    });
  });

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userWithoutPassword = { ...req.user };
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  });

  // Add the auth middleware for protected routes
  app.use((req, res, next) => {
    req.auth = {
      isAuthenticated: req.isAuthenticated.bind(req),
      user: req.user,
    };
    next();
  });
}

module.exports = { setupAuth, hashPassword, comparePasswords };