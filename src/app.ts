import express, { Application } from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";
import chatRouter from "./routes/chat";
import authRouter from "./routes/auth";
import path from "path";
import { path as rootDir } from "./util/path";
import * as jwt from "jsonwebtoken";

import morgan from "morgan";
import { env } from "./config/env";

const app: Application = express();

const server = createServer(app);
const io = new Server(server);
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

  if (!user) {
    console.log("Unauthorized");
    return;
  }

  socket.join(chatId);

  socket.on(chatId, (message: any) => {
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
