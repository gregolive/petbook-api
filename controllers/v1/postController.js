import { body, validationResult } from 'express-validator';
import Post from '../../models/post.js';

export const detail = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username first_name last_name')
    .catch((err) => { return res.status(400).json({ err }); });
  const comments = await Comment.find({ 'post': req.params.id }).sort({ created_at: -1 }).lean().populate('author', 'username');
  
  res.status(200).json({ post, comments });
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
        //author: req.body.author,
      });

      post.save((err) => {
        if (err) { return next(err); }
        res.status(200).json({ post });
      });
    }
  }
];
