import express from 'express';
import upload from '../config/multerConfig.js';
import verifyToken from '../config/verifyToken.js';
import * as authController from '../controllers/v1/authController.js';
import * as userController from '../controllers/v1/userController.js';
import * as postController from '../controllers/v1/postController.js';
import * as commentController from '../controllers/v1/commentController.js';

const authRouterV1 = express.Router();
const userRouterV1 = express.Router();
const postRouterV1 = express.Router();
const commentRouterV1 = express.Router({ mergeParams: true });

// Authentication routes
authRouterV1.post('/login', upload.none(), authController.login);
authRouterV1.post('/register', upload.none(), authController.register);
authRouterV1.get('/facebook', authController.facebookLogin);
authRouterV1.get('/facebook/callback', authController.facebookCallback);
authRouterV1.get('/google', authController.googleLogin);
authRouterV1.get('/google/callback', authController.googleCallback);

// User routes
userRouterV1.get('/:id', verifyToken, userController.detail);

// Post routes
postRouterV1.post('/create', verifyToken, upload.single('image'), postController.create);
postRouterV1.get('/index', verifyToken, postController.index);
postRouterV1.get('/index/:page', verifyToken, postController.index_page);

// Comment routes
commentRouterV1.post('/create', verifyToken, upload.none(), commentController.create);

export { authRouterV1, userRouterV1, postRouterV1, commentRouterV1 };
