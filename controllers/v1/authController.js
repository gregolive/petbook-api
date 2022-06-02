import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import User from '../../models/user.js';

export const login = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: info, user });
    }
    req.login(user, { session: false }, (err) => {
      if (err) { res.status(400).json({ err }); }
      const token = jwt.sign({ user }, process.env.TOKEN_ACCESS_SECRET);
      return res.json({ token });
    });
  })(req, res);
};

export const register = [
  // Validate and sanitize
  body('username').trim().isLength({ min: 5 }).escape().withMessage('Entered username must be at least 5 characters long')
    .matches('[a-zA-Z0-9-_]+$').withMessage('Username can only contain letters, numbers, dashes, and underscores').custom(async (username) => {
      return User.findOne({ username }).then((user) => {
        if (user) { return Promise.reject('Username already in use'); }
      });
    }),
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
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        user.save((error) => {
          if (error) { return next(error); }
          const token = jwt.sign({ user }, process.env.TOKEN_ACCESS_SECRET);
          res.status(200).json({ token });
        });
      });
    }
  }
];
