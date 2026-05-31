const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Session = require('../models/Session');
const Question = require('../models/Question');
const User = require('../models/User');
const { transcribeAudio, generateFeedback, generateSessionSummary, generateFollowUp } = require('../services/openai.service');

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /audio\/(webm|mp4|wav|mpeg|ogg)|video\/webm/;
    allowed.test(file.mimetype) ? cb(null, true) : cb(new Error('Audio files only'));
  }
});

const startSession = async (req, res) => {
  try {
    const { type = 'mixed', difficulty = 'medium', numQuestions = 5 } = req.body;
    const query = {};
    if (type !== 'mixed') query.category = type;
    query.difficulty = difficulty;
    const questions = await Question.aggregate([{ $match: query }, { $sample: { size: parseInt(numQuestions) } }]);
    if (questions.length === 0) return res.status(404).json({ message: 'No questions found for this category' });
    const session = await Session.create({ user: req.user._id, type, difficulty });
    res.json({ sessionId: session._id, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTextAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, questionText, answerText, category, timeTaken } = req.body;
    if (!answerText || answerText.trim().length < 10) {
      return res.status(400).json({ message: 'Answer too short. Please provide a detailed response.' });
    }
    const feedbackData = await generateFeedback(questionText, answerText, category);
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.answers.push({ questionId, questionText, answerText, score: feedbackData.score, feedback: { overall: feedbackData.overall, strengths: feedbackData.strengths, improvements: feedbackData.improvements, sampleAnswer: feedbackData.sampleAnswer, confidenceScore: feedbackData.confidenceScore, clarityScore: feedbackData.clarityScore, relevanceScore: feedbackData.relevanceScore }, timeTaken });
    await session.save();
    res.json({ feedback: feedbackData, questionIndex: session.answers.length - 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitVoiceAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, questionText, category, timeTaken } = req.body;
    const audioFile = req.file;
    if (!audioFile) return res.status(400).json({ message: 'No audio file provided' });
    const newPath = audioFile.path + '.webm';
    fs.renameSync(audioFile.path, newPath);
    const transcribedText = await transcribeAudio(newPath);
    try { fs.unlinkSync(newPath); } catch(e) {}
    if (!transcribedText || transcribedText.trim().length < 5) {
      return res.status(400).json({ message: 'Could not transcribe audio. Please try again.' });
    }
    const feedbackData = await generateFeedback(questionText, transcribedText, category);
    const session = await Session.findById(sessionId);
    session.answers.push({ questionId, questionText, answerText: transcribedText, score: feedbackData.score, feedback: { overall: feedbackData.overall, strengths: feedbackData.strengths, improvements: feedbackData.improvements, sampleAnswer: feedbackData.sampleAnswer, confidenceScore: feedbackData.confidenceScore, clarityScore: feedbackData.clarityScore, relevanceScore: feedbackData.relevanceScore }, timeTaken });
    await session.save();
    res.json({ transcribedText, feedback: feedbackData });
  } catch (error) {
    if (req.file) try { fs.unlinkSync(req.file.path); } catch(e) {}
    res.status(500).json({ message: error.message });
  }
};

const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    const scores = session.answers.map(a => a.score);
    const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const aiSummaryData = await generateSessionSummary(session.answers, session.type);
    session.avgScore = parseFloat(avgScore.toFixed(2));
    session.totalScore = scores.reduce((a, b) => a + b, 0);
    session.completed = true;
    session.aiSummary = aiSummaryData.summary;
    session.topicsToImprove = aiSummaryData.topicsToImprove;
    await session.save();
    const allSessions = await Session.find({ user: session.user, completed: true });
    const overallAvg = allSessions.reduce((sum, s) => sum + s.avgScore, 0) / allSessions.length;
    await User.findByIdAndUpdate(session.user, { $inc: { totalSessions: 1 }, avgScore: parseFloat(overallAvg.toFixed(2)), lastSessionDate: new Date() });
    res.json({ session, aiSummary: aiSummaryData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFollowUp = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const followUpQuestion = await generateFollowUp(question, answer);
    res.json({ followUpQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startSession, submitTextAnswer, submitVoiceAnswer: [upload.single('audio'), submitVoiceAnswer], completeSession, getFollowUp };
