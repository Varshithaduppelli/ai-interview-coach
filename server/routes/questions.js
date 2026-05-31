const express = require('express');
const router = express.Router();
const { getQuestions, seedQuestions } = require('../controllers/questions.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getQuestions);
router.post('/seed', seedQuestions);

module.exports = router;
