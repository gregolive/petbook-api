import app from '../app.js';
import http from 'http';

const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () =>
  console.log(`App listening on port ${port}.`),
);
