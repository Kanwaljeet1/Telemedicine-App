import express from "express";

const router = express.Router();

router.get("/open", (req, res) => {
  res.status(200).json({ message: "auth open works" });
});

export default router;
