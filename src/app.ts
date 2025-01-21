import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";

import chatRouter from "./routes/chat";
import path from "path";
import { path as rootDir } from "./util/path";

const app: Application = express();
const port = process.env.PORT || 8000;

const server = createServer(app);
const io = new Server(server);

// Middleware to parse JSON automatically
app.use(express.json());

// Middleware to parse URL-encoded data (optional, if you expect form submissions)
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

// Example custom middleware (optional)
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Chat Router
app.use("/chat", chatRouter);

app.get("/", (req, res, next) => {
  res.send("Typescript + Express = ❤️");
});

io.on("connection", (socket) => {
  const user = JSON.parse((socket.handshake.query.user as string) || "{}");
  console.log(user);
  console.log(
    `${user.name} connected to the chat ${socket.handshake.query.id}`
  );
  socket.on("chat", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

server.listen(port, () => {
  console.log(`Server is ON at http://localhost:${port}`);
});
