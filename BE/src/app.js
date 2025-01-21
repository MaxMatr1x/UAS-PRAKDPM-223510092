const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const profileRoutes = require('./routes/profileRoutes');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;
const HOST = process.env.HOST || '92.168.1.217';

app.use(cors());
app.use(express.json());

// Validasi MongoDB URL
const mongoURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
if (!mongoURI) {
    console.error('MongoDB URL is not defined in .env file');
    process.exit(1);
}

// Koneksi ke MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/profile', profileRoutes);

// Swagger Setup
setupSwagger(app);

// Jalankan Server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
