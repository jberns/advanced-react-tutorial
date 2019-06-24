const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
//!Look into what happens with PLAYGROUND_URL on the server

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //Put the userId onto future requests
    req.userId = userId;
  }
  next();
});

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
