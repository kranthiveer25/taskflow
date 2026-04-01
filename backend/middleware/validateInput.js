// ─── Input Validation & Sanitization Middleware ────────────────────────────
// Milestone 27: Validates and sanitizes all incoming user inputs
// on the backend before they reach controllers or the database.

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip HTML tags and trim whitespace to prevent XSS via stored content
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
};

// ── Registration validation ──────────────────────────────────────────────────
const validateRegister = (req, res, next) => {
  let { name, email, password, role } = req.body;

  // Sanitize strings
  req.body.name     = sanitizeString(name);
  req.body.email    = sanitizeString(email);
  req.body.password = typeof password === 'string' ? password.trim() : password;

  const errors = [];

  if (!req.body.name || req.body.name.length < 2)
    errors.push('Name must be at least 2 characters.');

  if (!req.body.email || !emailRegex.test(req.body.email))
    errors.push('Please provide a valid email address.');

  if (!req.body.password || req.body.password.length < 6)
    errors.push('Password must be at least 6 characters.');

  const allowedRoles = ['admin', 'teamleader', 'member'];
  if (role && !allowedRoles.includes(role))
    errors.push('Role must be admin, teamleader, or member.');

  if (errors.length > 0)
    return res.status(400).json({ message: 'Validation failed', errors });

  next();
};

// ── Login validation ─────────────────────────────────────────────────────────
const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  req.body.email    = sanitizeString(email);
  req.body.password = typeof password === 'string' ? password.trim() : password;

  const errors = [];

  if (!req.body.email || !emailRegex.test(req.body.email))
    errors.push('Please provide a valid email address.');

  if (!req.body.password || req.body.password.length < 1)
    errors.push('Password is required.');

  if (errors.length > 0)
    return res.status(400).json({ message: 'Validation failed', errors });

  next();
};

// ── Task creation validation ─────────────────────────────────────────────────
const validateTask = (req, res, next) => {
  let { title, description, priority, teamId, assignedTo } = req.body;

  req.body.title       = sanitizeString(title);
  req.body.description = sanitizeString(description);

  const errors = [];

  if (!req.body.title || req.body.title.length < 3)
    errors.push('Task title must be at least 3 characters.');

  if (!teamId)
    errors.push('Team ID is required.');

  if (!assignedTo)
    errors.push('Assigned user is required.');

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority))
    errors.push('Priority must be low, medium, or high.');

  if (errors.length > 0)
    return res.status(400).json({ message: 'Validation failed', errors });

  next();
};

// ── Team creation validation ─────────────────────────────────────────────────
const validateTeam = (req, res, next) => {
  let { name, description } = req.body;

  req.body.name        = sanitizeString(name);
  req.body.description = sanitizeString(description);

  const errors = [];

  if (!req.body.name || req.body.name.length < 2)
    errors.push('Team name must be at least 2 characters.');

  if (errors.length > 0)
    return res.status(400).json({ message: 'Validation failed', errors });

  next();
};

// ── Comment validation ───────────────────────────────────────────────────────
const validateComment = (req, res, next) => {
  let { text } = req.body;

  req.body.text = sanitizeString(text);

  if (!req.body.text || req.body.text.length < 1)
    return res.status(400).json({ message: 'Comment text cannot be empty.' });

  if (req.body.text.length > 1000)
    return res.status(400).json({ message: 'Comment cannot exceed 1000 characters.' });

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
  validateTeam,
  validateComment
};
