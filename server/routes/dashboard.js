const express = require('express');
const router = express.Router();
const { getStats, getSessionDetail } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/session/:id', protect, getSessionDetail);

module.exports = router;
