import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../database";
import { Server } from "socket.io";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Chat Page");
});

router.get("/create", (req: Request, res: Response) => {
  res.render("chat/create");
});

router.post("/create", async (req: Request, res: Response) => {
  const jwtToken = req.headers.jwt as string;
  const jwtSession = jwt.verify(
    jwtToken,
    env.JWT_PRIVATE_KEY,
    (err, decoded) => {
      if (err) {
        res.json({ success: false, message: "Invalid token" });
        return;
      }
    }
  );

  const _db = await db;
  const { chatName } = req.body;
  const chatId = uuidv4();
  await _db.chat.create({
    id: chatId,
    name: chatName,
    users: [],
    messages: [],
  });
  res.json({ success: true, id: chatId });
});

router.get("/:id", async (req: Request, res: Response) => {
  const _db = await db;
  const chat = await _db.chat.find((chat) => chat.id === req.params.id);

  if (chat) {
    const io = req.app.get("io") as Server;

    res.render("chat/chat", {
      chatInfo: { ...chat, sender: req.query.user },
    });
    return;
  }
  res.status(404).send("Chat not found");
});

router.get("/:id/join", async (req, res) => {
  const _db = await db;
  const chat = await _db.chat.find((chat) => chat.id === req.params.id);

  if (chat) {
    res.render("chat/join", {
      chatInfo: { name: chat.name, id: chat.id },
    });
    return;
  }
  res.status(404).send;
});

export default router;
