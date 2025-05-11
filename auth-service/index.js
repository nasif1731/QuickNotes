require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

require('./config/passport');

const app = express();
const authRoutes = require('./routes/auth');

// ✅ Redis client setup
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
  legacyMode: true,
});
redisClient.connect().catch(console.error);

// ✅ Redis session store
const store = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());

app.use(session({
  store,
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/auth', authRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
