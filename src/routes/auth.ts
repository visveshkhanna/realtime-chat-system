import { env } from "../config/env";
import { json, Router } from "express";
import * as jwt from "jsonwebtoken";

const router = Router();

router.get("/login", (req, res) => {
  return res.render("auth/login");
});

router.get("/register", (req, res) => {
  return res.render("auth/register");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const jwtToken = jwt.sign(
    { username },
    env.JWT_PRIVATE_KEY,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ status: "error", message: "Internal Server Error" });
      }
      return res.status(200).send({ status: "success", token });
    }
  );
});

export default router;
