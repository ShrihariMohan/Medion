import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieSession from 'cookie-session';
import env from 'dotenv';

env.config();

import googleOAuthRoute from './routes/googleOAuthRoute'
import userRoute from './routes/userRoute';
import draftRoute from './routes/draftRoute';
import { isLoggedIn } from './utils/authUtil';

mongoose.set("useFindAndModify", false);
const db = mongoose.connect(process.env.DB_URL || '',
  { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.KEY1!, process.env.KEY2!],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use((req, res, next) => {
  if (req.headers.origin !== undefined) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, *");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', googleOAuthRoute);
app.use('/api/user', isLoggedIn, userRoute);
app.use('/api/draft', isLoggedIn, draftRoute);

app.listen({ port: 3000 }, () => console.log('server started'));



