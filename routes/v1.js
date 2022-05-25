import express from 'express';
import * as authController from '../controllers/v1/authController.js';
import * as userController from '../controllers/v1/userController.js';
import * as postController from '../controllers/v1/postController.js';

const authRouterV1 = express.Router();
const userRouterV1 = express.Router();
const postRouterV1 = express.Router();

// Authentication routes
authRouterV1.post('/', authController.login);

// User routes
userRouterV1.post('/create', userController.create);
userRouterV1.get('/:id', userController.detail);

// Post routes
postRouterV1.post('/create', postController.create);
postRouterV1.get('/:id', postController.detail);

export { postRouterV1 };
