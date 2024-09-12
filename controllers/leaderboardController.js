const Leaderboard = require('../models/Leaderboard');

// Fetch the leaderboard for all quizzes
exports.getAllLeaderboardEntries = async(req, res) => {
    try {
        // Fetch all leaderboard entries, sort by score in descending order
        const leaderboard = await Leaderboard.find()
            .populate('user', 'username') // Populates the user's username
            .populate('quiz', 'title') // Populates the quiz title
            .sort({ score: -1 }); // Sort by score in descending order

        // If no entries found
        if (leaderboard.length === 0) {
            return res.status(404).json({ message: 'No leaderboard entries found' });
        }

        res.status(200).json(leaderboard); // Send the leaderboard data as JSON
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error while fetching leaderboard' });
    }
};