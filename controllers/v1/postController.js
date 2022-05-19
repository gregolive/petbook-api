import { body, validationResult } from 'express-validator';
import Post from '../../models/post.js';

export const postCreate = [
  // Validate and sanitize
  body('text', 'Post content required').trim().isLength({ min: 1 }).escape(),

  // Process request
  (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      console.log
      return res.status(400).json({ errors });
    } else {
      const post = new Post({ 
        text: req.body.text,
        //author: req.body.author,
      });

      post.save((err) => {
        if (err) { return next(err); }
        res.json({ post });
      });
    }
  }
];
