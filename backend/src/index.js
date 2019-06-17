require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

//TODO Use express middleware to handle cookies(JWT)
//TODO Use express middleware to populate current user
//!Look into what happens with PLAYGROUND_URL on the server

server.start(
  {
    cors: {
      credentials: true,
      origin: [process.env.FRONTEND_URL, process.env.PLAYGROUND_URL],
    },
  },
  details => {
    console.log(
      `Server is now running on port https:/localhost:${details.port}`,
    );
  },
);
