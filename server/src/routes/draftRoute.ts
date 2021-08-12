import express from 'express';
import { Draft } from '../models/draft';

const router = express.Router();

router.get("/", async (req, res, next) => {
  const drafts = await Draft.find({ userId: req.loggedInUser._id });
  res.status(200).send(drafts);
});

router.get("/feed/", async (req, res, next) => {
  const drafts = await Draft.find({ title: { $ne: "Getting Started" } });
  drafts.forEach((draft) => {
    console.log(draft.content == draft.preview)
    draft['content'] = draft.preview;
    console.log(draft.content == draft.preview)

  })
  res.status(200).send(drafts);
});

router.get("/:draftId", async (req, res, next) => {
  const draft = await Draft.findById(req.params.draftId);
  if (draft && !(draft?.userId == req.loggedInUser._id || req.loggedInUser.isSubscribed)) {
    draft.content = draft.preview;
  }
  res.status(200).send(draft);
});

router.post("/", async (req, res, next) => {
  console.log(req.loggedInUser._id, req.body.content, req.body.title)
  const draft = await new Draft({
    userId: req.loggedInUser._id,
    content: req.body.content, title: req.body.title,
    createdBy: req.loggedInUser.name,
    preview: req.body.preview,
    level: req.body.level
  }).save();
  console.log(draft);
  res.status(201).send(draft);
});

router.put("/", async (req, res, next) => {
  const draft = await Draft.findByIdAndUpdate(req.body.draftId, {
    content: req.body.content,
    title: req.body.title,
    preview: req.body.preview,
    level: req.body.level
  });
  res.status(201).send(draft);
});

router.delete("/", async (req, res, next) => {
  await Draft.findByIdAndDelete(req.body._id);
  res.status(204);
});

export = router;
