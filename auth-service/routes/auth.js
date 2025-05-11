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
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      console.log('✅ Google callback hit');
      console.log('User:', req.user); // <-- Log this

      if (!req.user) {
        return res.status(401).send('User not found after Google auth');
      }

      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET
      );

      req.logout((err) => {
        if (err) console.error('Logout error:', err);
        req.session.destroy(() => {
          console.log('✅ Session destroyed');
          res.send(`
            <h2>✅ Login Successful</h2>
            <p>Your JWT:</p>
            <pre>${token}</pre>
            <p>Use this token in Postman or your frontend.</p>
          `);
        });
      });
    } catch (err) {
      console.error('❌ Callback error:', err);
      res.status(500).send('OAuth callback failed');
    }
  }
);



export default router;