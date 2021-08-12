import express from 'express';
import { User } from '../models/user';


const router = express.Router();

router.get("/me", async (req, res, next) => {
  const userData = await User.findOne({ email: req.user?._json.email });
  res.send(userData);
});

router.post("/subscription", async (req, res, next) => {
  const userData = await User.findByIdAndUpdate(req.loggedInUser._id, {
    isSubscribed: req.body.isSubscribed
  });

  const updatedData = await User.findById(req.loggedInUser._id)
  res.send(updatedData);
});

export = router;
