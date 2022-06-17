import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js';

export const login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, msg) => {
    if (err || !user) {
      return res.status(400).json({ msg, user });
    }
    req.login(user, { session: false }, (error) => {
      if (error) { res.status(400).json({ error }); }
      const token = jwt.sign({ userId: user._id }, process.env.TOKEN_ACCESS_SECRET);
      return res.json({ token });
    });
  })(req, res);
};

export const register = [
  // Validate and sanitize
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Please enter a name')
    .matches('[a-zA-Z ]+$').withMessage('Name can only contain letters and spaces'),
  body('email').trim().escape().isEmail().withMessage('Please enter a valid email').custom(async (email) => {
    return User.findOne({ email }).then((user) => {
      if (user) { return Promise.reject('Email already in use'); }
    });
  }),
  body('password').trim().escape().matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,}').withMessage('Entered password must be at least 6 characters long and contain an uppercase letter, number, and special character'),
  
  // Process request
  (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      bcrypt.hash(req.body.password, 16, (err, hashedPassword) => {
        if (err) { return next(err); }
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        user.save((error) => {
          if (error) { return next(error); }
          const token = jwt.sign({ userId: user._id }, process.env.TOKEN_ACCESS_SECRET);
          res.status(200).json({ token });
        });
      });
    }
  }
];

export const facebookLogin = passport.authenticate('facebook', { scope: ['email'] });

export const facebookCallback = [
  passport.authenticate('facebook', { failureRedirect: `${process.env.CLIENT_URL}/welcome` }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.TOKEN_ACCESS_SECRET);
    res.cookie('jwt', token);
    res.redirect(process.env.CLIENT_URL);
  }
];

export const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
});

export const googleCallback = [
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/welcome` }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.TOKEN_ACCESS_SECRET);
    res.cookie('jwt', token);
    res.redirect(process.env.CLIENT_URL);
  }
];