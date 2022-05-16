import express from 'express';

import { router } from './routes/index.js';

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define routes
app.use('/', router);

export default app;
