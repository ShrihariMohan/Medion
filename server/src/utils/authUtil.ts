
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    const signedInUser = req.user._json;
    const user = await User.findOne({ email: signedInUser.email }).exec();
    req.loggedInUser = user;
    next();
  } else {
    res.sendStatus(401);
  }
};
