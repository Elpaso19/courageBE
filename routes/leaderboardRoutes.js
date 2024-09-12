const express = require('express');
const { getAllLeaderboardEntries } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Fetch leaderboard (Available to all authenticated users)
router.get('/', protect, getAllLeaderboardEntries);

module.exports = router;