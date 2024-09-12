const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true }, // Array of options
    correctAnswer: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    timeLimit: { type: Number, required: true }, // Time limit in minutes
    questions: [QuestionSchema], // Array of questions
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the user who created it
});

module.exports = mongoose.model('Quiz', QuizSchema);