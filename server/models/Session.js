const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  questionText: String,
  answerText: String,
  audioUrl: String,
  score: { type: Number, min: 0, max: 10 },
  feedback: {
    overall: String,
    strengths: [String],
    improvements: [String],
    sampleAnswer: String,
    confidenceScore: Number,
    clarityScore: Number,
    relevanceScore: Number
  },
  timeTaken: Number
});

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['technical', 'behavioral', 'system-design', 'mixed'], default: 'mixed' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  answers: [answerSchema],
  totalScore: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  duration: Number,
  completed: { type: Boolean, default: false },
  aiSummary: String,
  topicsToImprove: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
