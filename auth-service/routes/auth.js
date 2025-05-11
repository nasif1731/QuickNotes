import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Google OAuth Login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback (with session cleanup)
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false  // Disable sessions for JWT flow
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('/login?error=no_user');
      }

      // Generate JWT
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Redirect to frontend with token
      res.redirect//(http://localhost:5173/auth-success?token=${token});
      
    } catch (error) {
      console.error('❌ Callback error:', error);
      res.redirect('/login?error=server_error');
    }
  }
);




export default router;