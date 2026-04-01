require('./models/User');
require('./models/Team');
require('./models/TeamMember');
require('./models/Task');
require('./models/Comment');
require('./models/ActivityLog');
require('./models/TaskFile');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const { protect, authorizeRoles } = require('./middleware/authMiddleware');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
dotenv.config();
connectDB();

const app = express();

// ─── Security Headers (replaces helmet) ───────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

app.use(cors());
app.use(express.json({ limit: '10kb' })); // reject payloads over 10KB

// ─── NoSQL Injection Sanitizer (replaces express-mongo-sanitize) ───────────────
// Strips keys starting with $ or containing . from body, query and params
const sanitize = (obj) => {
  if (Array.isArray(obj)) {
    obj.forEach((item) => sanitize(item));
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    });
  }
};

app.use((req, res, next) => {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// ─── Rate Limiter (replaces express-rate-limit) ────────────────────────────────
// Allows max 20 auth requests per IP per 15 minutes — blocks brute-force login
const loginAttempts = new Map();
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS   = 20;

const rateLimiter = (req, res, next) => {
  const ip  = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry) {
    // Clear window if expired
    if (now - entry.start > RATE_WINDOW_MS) {
      loginAttempts.set(ip, { count: 1, start: now });
      return next();
    }
    if (entry.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - entry.start)) / 1000);
      return res.status(429).json({
        message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`
      });
    }
    entry.count++;
  } else {
    loginAttempts.set(ip, { count: 1, start: now });
  }
  next();
};

app.use('/api/auth', rateLimiter, authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('TaskFlow API is running...');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});