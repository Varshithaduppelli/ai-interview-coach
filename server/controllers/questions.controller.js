const Question = require('../models/Question');

const getQuestions = async (req, res) => {
  try {
    const { category, difficulty, limit = 20 } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    const questions = await Question.find(query).limit(parseInt(limit));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedQuestions = async (req, res) => {
  try {
    const count = await Question.countDocuments();
    if (count > 0) return res.json({ message: `Already have ${count} questions` });

    const questions = [
      { text: 'Tell me about yourself and why you want this role.', category: 'hr', difficulty: 'easy', tags: ['intro', 'motivation'] },
      { text: 'What is the difference between == and === in JavaScript?', category: 'technical', difficulty: 'easy', tags: ['javascript', 'basics'] },
      { text: 'Explain the concept of closures in JavaScript with an example.', category: 'technical', difficulty: 'medium', tags: ['javascript', 'closures'] },
      { text: 'What is the event loop in Node.js and how does it work?', category: 'technical', difficulty: 'medium', tags: ['nodejs', 'async'] },
      { text: 'Explain RESTful API design principles.', category: 'technical', difficulty: 'medium', tags: ['api', 'rest', 'backend'] },
      { text: 'What is the difference between SQL and NoSQL databases?', category: 'technical', difficulty: 'easy', tags: ['database', 'sql', 'nosql'] },
      { text: 'Design a URL shortener like bit.ly. Walk me through your approach.', category: 'system-design', difficulty: 'medium', tags: ['system-design', 'scalability'] },
      { text: 'How would you design Twitter\'s timeline feature for 100 million users?', category: 'system-design', difficulty: 'hard', tags: ['system-design', 'scalability', 'twitter'] },
      { text: 'Tell me about a time you handled a conflict with a teammate.', category: 'behavioral', difficulty: 'medium', tags: ['conflict', 'teamwork', 'star'] },
      { text: 'Describe a situation where you had to learn something quickly under pressure.', category: 'behavioral', difficulty: 'medium', tags: ['learning', 'pressure', 'star'] },
      { text: 'What are React hooks and how do they change component development?', category: 'technical', difficulty: 'medium', tags: ['react', 'hooks', 'frontend'] },
      { text: 'Explain the concept of indexing in databases and when you would use it.', category: 'technical', difficulty: 'medium', tags: ['database', 'indexing', 'performance'] },
      { text: 'What is your greatest weakness and how are you working on it?', category: 'hr', difficulty: 'easy', tags: ['self-awareness', 'growth'] },
      { text: 'Explain Big O notation with examples.', category: 'technical', difficulty: 'medium', tags: ['algorithms', 'complexity', 'dsa'] },
      { text: 'How would you reverse a linked list? Write the code.', category: 'technical', difficulty: 'medium', tags: ['dsa', 'linked-list', 'coding'] },
      { text: 'Design a notification system for a social media platform.', category: 'system-design', difficulty: 'hard', tags: ['system-design', 'notifications'] },
      { text: 'What is JWT and how does authentication work with it?', category: 'technical', difficulty: 'medium', tags: ['auth', 'security', 'jwt'] },
      { text: 'Tell me about your most challenging project and what you learned.', category: 'behavioral', difficulty: 'medium', tags: ['projects', 'learning', 'star'] },
      { text: 'Where do you see yourself in 5 years?', category: 'hr', difficulty: 'easy', tags: ['career', 'goals'] },
      { text: 'Explain how you would optimize a slow database query.', category: 'technical', difficulty: 'hard', tags: ['database', 'optimization', 'performance'] }
    ];

    await Question.insertMany(questions);
    res.json({ message: `Seeded ${questions.length} questions successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestions, seedQuestions };
