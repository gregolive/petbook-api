import Post from '../../models/post.js';

export const postCreate = (req, res, next) => {
  const post = new Post({ 
    title: req.body.title,
    formatted_title: req.body.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase(),
    content: req.body.content,
    author: req.body.author,
    preview: req.body.preview,
    visibility: req.body.visibility,
  });

  console.log(post);
};
