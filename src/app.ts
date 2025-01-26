import express, { Application } from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";
import chatRouter from "./routes/chat";
import authRouter from "./routes/auth";
import path from "path";
import { path as rootDir } from "./util/path";
import * as jwt from "jsonwebtoken";
import addSecurityMiddleware from "./middlewares/security";
import { v4 as uuidv4 } from "uuid";

import db from "./database";

import morgan from "morgan";
import { env } from "./config/env";

const app: Application = express();

const server = createServer(app);
const io = new Server(server);

addSecurityMiddleware(app);

app.set("io", io);

const port = env.PORT;

// Middleware to parse JSON automatically
app.use(express.json());

// Middleware to parse URL-encoded data (optional, if you expect form submissions)
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

app.use(express.static(path.join(rootDir, "views/scripts")));

app.use(morgan("dev"));

interface AuthRequest extends Request {
  user: any;
}

// AUTH MIDDLEWARE
app.use((req, res, next) => {
  // const token = req.headers.jwt as string;
  // console.log("JWT TOKEN", token);
  next();
});

// Chat Router
app.use("/chat", chatRouter);
app.use("/auth", authRouter);

app.get("/", (req, res, next) => {
  res.send("Typescript + Express = ❤️");
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const jwtToken = socket.handshake.query.jwt as string;
  const chatId = socket.handshake.query.id as string;
  const username = socket.handshake.query.username as string;

  var user: any;
  const jwtSession = jwt.verify(
    jwtToken,
    env.JWT_PRIVATE_KEY,
    (err, decoded) => {
      if (err) {
        console.log("Error in verifying JWT token", err);
        return;
      }

      user = JSON.parse(JSON.stringify(decoded));
    }
  );

  console.log(user, username);

  if (!user || user.username !== username) {
    console.log("Unauthorized");
    return;
  }

  socket.join(chatId);

  socket.on(chatId, async (message: any) => {
    const _db = await db;
    const chat = await _db.chat.find((chat) => chat.id === chatId);
    if (!chat) {
      return;
    }

    console.log(
      `Received message in chat ${chatId} from ${user.username}:`,
      message
    );

    if (message.type === "action") {
      socket.broadcast.to(chatId).emit(chatId, {
        type: "action",
        from: user.username,
        action: message.action,
      });
    }
    if (message.type === "message") {
      chat.messages.push({
        id: uuidv4(),
        from: user.username,
        content: message.content,
      });
      await _db.chat.update(chatId, {
        messages: chat.messages,
      });
      socket.broadcast.to(chatId).emit(chatId, {
        type: "message",
        from: user.username,
        content: message.content,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

server.listen(port, () => {
  console.log(`Server is ON at http://localhost:${port}`);
});
