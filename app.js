import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';

import initializeMongo from './config/mongoConfig.js';
import initializePassport from './config/passportConfig.js';
import { authRouterV1, userRouterV1, postRouterV1 } from './routes/v1.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb/mongoose connection set up
initializeMongo(mongoose);

// passport setup
initializePassport(passport);
app.use(passport.initialize());

// define routes
app.use('/api/v1/auth', authRouterV1);
app.use('/api/v1/user', userRouterV1);
app.use('/api/v1/post', postRouterV1);

export default app;
