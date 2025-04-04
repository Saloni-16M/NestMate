const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Initialize middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/api/users'));
app.use('/api/properties', require('./routes/api/properties'));
app.use('/api/messages', require('./routes/api/messages'));
app.use('/api/roommates', require('./routes/api/roommates'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Set port
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
