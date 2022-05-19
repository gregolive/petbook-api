import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import initializeMongo from './config/mongoConfig.js';
import upload from './config/multerConfig.js';
import { postRouterV1 } from './routes/v1.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb/mongoose connection set up
initializeMongo(mongoose);

// define routes
app.use('/api/v1/post', upload.none(), postRouterV1);

export default app;
