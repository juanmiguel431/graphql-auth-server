import 'dotenv/config';
import './mongoose/connect';
import express from "express";
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';

const app = express();
app.use(cors({
  origin: process.env.REACT_CLIENT,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

app.all('/graphql', createHandler({ schema }));

app.get('/', (req, res) => {
  res.send('Hello World.');
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
