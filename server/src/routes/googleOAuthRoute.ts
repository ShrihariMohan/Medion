import express from 'express';
import passport from 'passport';
import { isLoggedIn } from '../utils/authUtil';

import '../utils/passportSetup';
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  isLoggedIn,
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/home' || '');
  }
);

router.get("/logout", (req: any, res) => {
  req.session = null;
  req.logout();
  res.redirect(`${process.env.CLIENT_URL}/`);
});

router.get("/failed", (req, res) => res.send("You Failed to log in!"));

export = router;
