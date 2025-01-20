import { Router } from "express";
import path from "path";
import { path as rootDir } from "../util/path";

const router = Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "chat.html"));
});

export default router;
