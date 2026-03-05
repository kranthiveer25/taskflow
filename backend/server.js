require('./models/User');
require('./models/Team');
require('./models/TeamMember');
require('./models/Task');
require('./models/Comment');
require('./models/ActivityLog');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect, authorizeRoles } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('TaskFlow API is running...');
});

app.get('/api/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});

app.get('/api/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

app.get('/api/leader', protect, authorizeRoles('admin', 'teamleader'), (req, res) => {
  res.json({ message: 'Welcome Team Leader!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});