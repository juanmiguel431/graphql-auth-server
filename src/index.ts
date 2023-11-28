import 'dotenv/config';
import './mongoose/connect';
import express from "express";
import session from 'express-session';
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { mongoUrl } from './mongoose/connect';

const app = express();
app.use(cors({
  origin: process.env.REACT_CLIENT,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));
app.use(express.json());

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'aaabbbccc',
    store: MongoStore.create({
      mongoUrl: mongoUrl,
    })
  })
);

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also services/auth.js
app.use(passport.initialize());
app.use(passport.session());

// app.all('/graphql', createHandler({ schema }));
app.all('/graphql', (req, res, next) => {
  const handler = createHandler({ schema, context: req as any });
  handler(req, res, next);
});

app.get('/', (req, res) => {
  res.send('Hello World.');
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
