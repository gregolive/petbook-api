import express from 'express';
import * as postController from '../controllers/postController.js';

const postRouter = express.Router();

// Post routes
postRouter.get('/create', postController.postCreate);

export { postRouter };
