import 'dotenv/config';
import './mongoose/connect';
import express from "express";
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import passport from 'passport';

const app = express();
app.use(cors({
  origin: process.env.REACT_CLIENT,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also services/auth.js
app.use(passport.initialize());
app.use(passport.session());

app.all('/graphql', createHandler({ schema }));

app.get('/', (req, res) => {
  res.send('Hello World.');
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
