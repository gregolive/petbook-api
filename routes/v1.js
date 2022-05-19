import express from 'express';
import * as authController from '../controllers/v1/authController.js';
import * as postController from '../controllers/v1/postController.js';

const authRouterV1 = express.Router();
const postRouterV1 = express.Router();

// Authentication routes
authRouterV1.post('/', authController.login)

// Post routes
postRouterV1.post('/create', postController.postCreate);

export { postRouterV1 };
