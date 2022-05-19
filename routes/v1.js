import express from 'express';
import * as postController from '../controllers/v1/postController.js';

const postRouterV1 = express.Router();

// Post routes
postRouterV1.post('/create', postController.postCreate);

export { postRouterV1 };
