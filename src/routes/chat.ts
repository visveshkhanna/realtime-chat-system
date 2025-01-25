import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { chats } from "../util/db";
import { Server } from "socket.io";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Chat Page");
});

router.get("/create", (req: Request, res: Response) => {
  res.render("chat/create");
});

router.post("/create", (req: Request, res: Response) => {
  const { userId } = req.body;
  const chatId = uuidv4();
  chats.push({ id: chatId, from: userId, to: null, messages: [] });
  res.json({ success: true, id: chatId });
});

router.get("/:id", (req: Request, res: Response) => {
  const chat = chats.find((chat) => chat.id === req.params.id);
  if (chat) {
    const io = req.app.get("io") as Server;

    res.render("chat/chat", {
      chatInfo: { ...chat, sender: req.query.userId },
    });
    return;
  }
  res.status(404).send("Chat not found");
});

export default router;
