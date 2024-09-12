const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Leaderboard = require('../models/Leaderboard');

// Create a new quiz (Admin only)
// const Quiz = require('../models/Quiz');

// Create a new quiz
exports.createQuiz = async(req, res) => {
    const { title, timeLimit, questions } = req.body;

    try {
        // Validation (you can add more)
        if (!title || !timeLimit || questions.length === 0) {
            return res.status(400).json({ message: 'Please fill in all fields and add at least one question.' });
        }

        // Create a new quiz document
        const newQuiz = new Quiz({
            title,
            timeLimit,
            questions,
            createdBy: req.user._id // Assuming you're storing the admin's ID here
        });

        // Save to DB
        await newQuiz.save();
        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Server error. Could not create quiz.' });
    }
};


// Fetch all quizzes (for students to select from)
exports.getAllQuizzes = async(req, res) => {
    try {
        const quizzes = await Quiz.find().select('title timeLimit'); // Select only necessary fields
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Server error. Failed to fetch quizzes.' });
    }
};




// Fetch a specific quiz by ID
// quizController.js
// const Quiz = require('../models/Quiz'); // Assuming Quiz is a Mongoose model

// Get quiz by ID
exports.getQuizById = async(req, res) => {
    try {
        // Validate that quizId is a valid MongoDB ObjectId
        const { quizId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Invalid quiz ID format.' });
        }

        // Find the quiz by its ID
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz); // Return quiz data
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// module.exports = { getQuizById };

// Submit a quiz and calculate the score
exports.submitQuiz = async(req, res) => {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
            score++;
        }
    });

    const percentage = (score / quiz.questions.length) * 100;
    let grade = 'F';
    if (percentage >= 70) grade = 'A';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 45) grade = 'D';
    else if (percentage >= 40) grade = 'E';

    // Save result to leaderboard
    const leaderboardEntry = await Leaderboard.create({
        user: req.user._id,
        quiz: quiz._id,
        score,
        grade,
    });

    res.status(200).json({ score, grade });
};