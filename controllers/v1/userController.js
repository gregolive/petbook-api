import { body, validationResult } from 'express-validator';
import User from '../../models/user.js';
import Post from '../../models/user.js';

export const detail = async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .catch((err) => { return res.status(400).json({ err }); });
  const posts = await Post.find({ 'author': req.params.id }).sort({ created_at: -1 }).limit(3).populate('author', 'username name')
    .catch((err) => { return res.status(400).json({ err }); });

  res.status(200).json({ user, posts });
};
