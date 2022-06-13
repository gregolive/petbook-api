import { body, validationResult } from 'express-validator';
import { uploadFile, downloadFile } from '../../config/bucketConfig.js';
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
  async (req, res, next) => {
    console.log(req.body)
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    } else {
      // upload image to AWS
      const file = req.file;
      let fileUrl;
      if (file) {
        const result = await uploadFile(req.file);
        fileUrl = result.Location;
      }
      
      const post = new Post({ 
        text: req.body.text,
        img_url: fileUrl,
        author: res.locals.user._id,
      });

      post.save((err) => {
        if (err) { return next(err); }
        res.status(200).json({ post });
      });
    }
  }
];
