import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  console.log("INSIDE THE MIDDLEWARE!!!");
  next();
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is ON at http://localhost:${port}`);
});
