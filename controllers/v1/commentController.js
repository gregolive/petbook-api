import { body, validationResult } from 'express-validator';
import Comment from '../../models/comment.js';

export const create = [
  // Validate and sanitize
  body('text', 'Comment is empty').trim().isLength({ min: 1 }).escape(),

  // Process request
  async (req, res, next) => {
    console.log('commenting')
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      const comment = new Comment({ 
        text: req.body.text,
        author: res.locals.user._id,
        post: req.params.postId,
        parentComment: req.body.parentComment,
      });

      comment.save((err) => {
        if (err) { return next(err); }
        Comment.findOne(comment).populate('author', 'username name url').exec((error, populated_comment) => {
          res.status(200).json({ comment: populated_comment });
        });
      });
    }
  }
];
