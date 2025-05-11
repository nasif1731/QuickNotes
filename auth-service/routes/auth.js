const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  }
);

module.exports = router;
