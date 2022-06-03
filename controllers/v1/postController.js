import { body, validationResult } from 'express-validator';
import Post from '../../models/post.js';

export const index = async (req, res) => {
  const user = res.locals.user;
  const posts = await Post.find({author: user._id}).populate('author', 'username name url')
    .catch((err) => { return res.status(400).json({ err }); });

  return res.status(200).json({ user, posts });
};

export const create = [
  // Validate and sanitize
  body('text', 'Post content required').trim().isLength({ min: 1 }).escape(),

  // Process request
  (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      const post = new Post({ 
        text: req.body.text,
        author: res.locals.user._id,
      });

      post.save((err) => {
        if (err) { return next(err); }
        res.status(200).json({ post });
      });
    }
  }
];
