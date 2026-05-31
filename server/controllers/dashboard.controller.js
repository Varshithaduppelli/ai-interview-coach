const Session = require('../models/Session');
const User = require('../models/User');

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ user: userId, completed: true }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    const scoreHistory = sessions.slice(0, 10).reverse().map(s => ({
      date: s.createdAt,
      score: s.avgScore,
      type: s.type
    }));

    const categoryBreakdown = {};
    sessions.forEach(session => {
      session.answers.forEach(answer => {
        const cat = answer.questionId?.category || 'general';
        if (!categoryBreakdown[cat]) categoryBreakdown[cat] = { total: 0, count: 0 };
        categoryBreakdown[cat].total += answer.score;
        categoryBreakdown[cat].count += 1;
      });
    });

    const categoryAvgs = Object.entries(categoryBreakdown).map(([cat, data]) => ({
      category: cat,
      avgScore: parseFloat((data.total / data.count).toFixed(2))
    }));

    const recentSessions = sessions.slice(0, 5).map(s => ({
      _id: s._id,
      type: s.type,
      difficulty: s.difficulty,
      avgScore: s.avgScore,
      totalQuestions: s.answers.length,
      createdAt: s.createdAt,
      topicsToImprove: s.topicsToImprove
    }));

    res.json({
      totalSessions: user.totalSessions,
      avgScore: user.avgScore,
      streak: user.streak,
      scoreHistory,
      categoryAvgs,
      recentSessions,
      topicsToImprove: [...new Set(sessions.flatMap(s => s.topicsToImprove || []))].slice(0, 6)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSessionDetail = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getSessionDetail };
