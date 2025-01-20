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

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

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
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(port, () => {
  console.log(`Server is ON at http://localhost:${port}`);
});
