import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";

import chatRouter from "./routes/chat";
import path from "path";
import { path as rootDir } from "./util/path";

const app: Application = express();
const port = process.env.PORT || 8000;

// Middleware
app.use((req, res, next) => {
  console.log("INSIDE THE MIDDLEWARE!!!");
  next();
});

// Chat Router
app.use("/chat", chatRouter);

app.get("/", (req, res, next) => {
  res.send("Typescript + Express = ❤️");
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(port, () => {
  console.log(`Server is ON at http://localhost:${port}`);
});
