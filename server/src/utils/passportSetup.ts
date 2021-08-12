import passport from 'passport';
import { User } from '../models/user';
import { isLoggedIn } from './authUtil';

const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.G_CLIENT_ID,
      clientSecret: process.env.G_SECRET,
      callbackURL: `${process.env.DOMAIN}/auth/google/callback`,
    },
    async function (_: any, __: any, profile: any, done: any) {
      const { _json: { email, name } } = profile;
      const user = await User.findOne({ email }).exec();
      if (!user) {
        const user = new User({ email, name });
        await user.save();
      }
      return done(null, profile);

    }
  )
);


