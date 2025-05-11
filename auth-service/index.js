import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectRedis from 'connect-redis'; // <-- Change this import
import passport from 'passport';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import redisClient from './config/redis.js';
import './config/passport.js'; // ✅ <-- this is crucial
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Initialize RedisStore with express-session
const RedisStore = connectRedis(session); // <-- Fix here

// Configure session middleware
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }), // Now works!
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 // 1 hour
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Initialize connections
(async () => {
  await connectDB();
  await redisClient.connect();
})();

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});