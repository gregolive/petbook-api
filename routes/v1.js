import express from 'express';
import upload from '../config/multerConfig.js';
import * as authController from '../controllers/v1/authController.js';
import * as userController from '../controllers/v1/userController.js';
import * as postController from '../controllers/v1/postController.js';

const authRouterV1 = express.Router();
const userRouterV1 = express.Router();
const postRouterV1 = express.Router();

// Authentication routes
authRouterV1.post('/login', upload.none(), authController.login);
authRouterV1.post('/register', upload.none(), authController.register);

// User routes
userRouterV1.get('/:id', userController.detail);

// Post routes
postRouterV1.post('/create', upload.none(), postController.create);
postRouterV1.get('/:id', postController.detail);

export { authRouterV1, userRouterV1, postRouterV1 };
