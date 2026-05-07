const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validateAuthSignup, validateAuthLogin } = require('../utils/validation');

// Simple password hashing (for demo; use bcrypt in production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const isBcryptHash = (value) => typeof value === 'string' && value.startsWith('$2');

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validation = validateAuthSignup({ name, email, password });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message, errors: validation.errors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateAuthLogin({ email, password });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message, errors: validation.errors });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let passwordMatches = false;

    if (isBcryptHash(user.password)) {
      passwordMatches = await bcrypt.compare(password, user.password);
    } else {
      const hashedPassword = hashPassword(password);
      passwordMatches = user.password === hashedPassword;

      if (passwordMatches) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };
