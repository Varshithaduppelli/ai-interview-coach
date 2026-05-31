const express = require('express');
const router = express.Router();
const { startSession, submitTextAnswer, submitVoiceAnswer, completeSession, getFollowUp } = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth');

router.post('/start', protect, startSession);
router.post('/answer/text', protect, submitTextAnswer);
router.post('/answer/voice', protect, ...submitVoiceAnswer);
router.post('/complete', protect, completeSession);
router.post('/followup', protect, getFollowUp);

module.exports = router;
