import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import Post from '../../models/user.js';

export const detail = async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .catch((err) => { return res.status(400).json({ err }); });
  const posts = await Post.find({ 'author': req.params.id }).sort({ created_at: -1 }).limit(3).populate('author', 'username name')
    .catch((err) => { return res.status(400).json({ err }); });

  res.status(200).json({ user, posts });
};

export const create = [
  // Validate and sanitize
  body('username').trim().isLength({ min: 5 }).escape().withMessage('Username must be at least 5 characters long')
    .isAlphanumeric().withMessage('Username cannot contain non-alphanumeric characters').custom(async (username) => {
      return User.findOne({ username }).then((user) => {
        if (user) { return Promise.reject('Username already in use'); }
      });
    }),
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Please enter your name')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters'),
  body('email').trim().escape().isEmail().withMessage('Please enter a valid email address').custom(async (email) => {
    return User.findOne({ email }).then((user) => {
      if (user) { return Promise.reject('Email already in use'); }
    });
  }),
  body('password').trim().isLength({ min: 6 }).escape().withMessage('Password must be at least than 6 characters long')
    .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,}').withMessage('Password must contain an uppercase letter, number, and special character'),
  
  // Process request
  (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      bcrypt.hash(req.body.password, 64, (err, hashedPassword) => {
        if (err) { return next(err); }
        const user = new User({
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        user.save((error) => {
          if (error) { return next(error); }
          res.status(200).json({ user });
        });
      });
    }
  }
];
