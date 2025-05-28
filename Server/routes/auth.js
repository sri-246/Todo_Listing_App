const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      console.log('Callback User:', req.user); // Debug
      const user = await User.findOne({ googleId: req.user.googleId });
      if (!user) throw new Error('User not found');
      console.log('Found User:', user); // Debug
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token:', token); // Debug
      const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?token=${token}`;
      console.log('Redirecting to:', redirectUrl); // Debug
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).send('Authentication failed');
    }
  }
);

router.get('user', async (req,res) => {
    const token = req.header('Authorization')?.replace('Bearer', '');
    if(!token) return res.status(401).json({msg:'No token provided'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-tasks');
        res.json(user);
    }catch(error){
        res.status(401).json({msg:'Invalid token'});
    }
});

module.exports = router;