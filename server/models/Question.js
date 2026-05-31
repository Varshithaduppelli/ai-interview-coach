const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, enum: ['technical', 'behavioral', 'system-design', 'hr'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  tags: [String],
  sampleAnswer: String,
  followUps: [String],
  timesAsked: { type: Number, default: 0 }
});

module.exports = mongoose.model('Question', questionSchema);
