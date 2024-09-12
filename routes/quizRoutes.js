const express = require('express');
const { createQuiz, getAllQuizzes, getQuizById, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new quiz (Admin only)
router.post('/create', protect, createQuiz);

// Get a specific quiz by ID (Available to both students and admins)
router.get('/', protect, getAllQuizzes);

router.get('/:quizId', protect, getQuizById);
// Submit quiz and calculate score (Students)
router.post('/:quizId/submit', protect, submitQuiz);








module.exports = router;