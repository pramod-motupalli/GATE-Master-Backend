// index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from './models/User.js';
import Attempt from './models/Attempt.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- AUTHENTICATION & USER ROUTES ---

const SECRET_KEY = process.env.SECRET_KEY;

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

    return res.json({ message: `Welcome back, ${user.name}!`, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// RESET PASSWORD
app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, userPayload) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = userPayload;
    next();
  });
};

// --- ATTEMPT ROUTES ---

// 1. Submit a new test attempt
app.post('/api/attempts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subjectId, paperId, score, totalQuestions, responses } = req.body;

    if (!subjectId || !paperId || score == null || totalQuestions == null || !responses) {
      return res.status(400).json({ message: 'Incomplete attempt data provided.' });
    }

    const newAttempt = new Attempt({
      user: userId,
      subjectId,
      paperId,
      score,
      totalQuestions,
      responses,
    });

    const savedAttempt = await newAttempt.save();

    await User.findByIdAndUpdate(userId, {
      $push: { attempts: savedAttempt._id },
    });

    res.status(201).json({ message: 'Attempt saved successfully!', attempt: savedAttempt });

  } catch (error) {
    console.error('Error saving attempt:', error);
    res.status(500).json({ message: 'Server error while saving the attempt.' });
  }
});

// 2. Get all attempts for the logged-in user
app.get('/api/attempts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const attempts = await Attempt.find({ user: userId }).sort({ completedAt: -1 });
    res.status(200).json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Server error while fetching attempts.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
