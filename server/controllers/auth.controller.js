const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, targetRole: targetRole || 'Software Engineer' });
    res.status(201).json({ token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, targetRole } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, targetRole }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
