import { body, validationResult } from 'express-validator';
import { uploadFile, downloadFile } from '../../config/s3Config.js';
import Post from '../../models/post.js';

export const index = async (req, res) => {
  const user = res.locals.user;
  const posts = await Post.find({author: user._id}).sort({ created_at: -1 }).populate('author', 'username name url')
    .catch((err) => { return res.status(400).json({ err }); });

  return res.status(200).json({ user, posts });
};

export const create = [
  // Validate and sanitize
  body('text', 'Post content required').trim().isLength({ min: 1 }).escape(),

  // Process request
  async (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      // upload image to AWS
      const file = req.file;
      let fileKey;
      if (file) {
        const result = await uploadFile(req.file);
        fileKey = result.Key;
      }
      
      const post = new Post({ 
        text: req.body.text,
        image: fileKey,
        author: res.locals.user._id,
      });

      post.save((err) => {
        if (err) { return next(err); }
        Post.findOne(post).populate('author', 'username name url').exec((error, populated_post) => {
          res.status(200).json({ post: populated_post });
        });
      });
    }
  }
];
