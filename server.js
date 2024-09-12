require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: 'https://courage-quiz.onrender.com', credentials: true })); // Adjust CORS origin as needed

// Passport.js middleware
require('./config/passport'); // Initialize Passport configuration
app.use(passport.initialize());

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'mySuperSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }, // In production, use secure cookies
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});