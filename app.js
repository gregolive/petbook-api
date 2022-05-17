import express from 'express';

import { postRouter } from './routes/v1.js';

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define routes
app.use('/', postRouter);

export default app;
