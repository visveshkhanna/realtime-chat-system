import hpp from "hpp";
import helmet from "helmet";
import { Application } from "express";

const securityMiddleware = (server: Application) => {
  server.disable("x-powered-by");
  server.use(hpp());
  server.use(helmet.xssFilter());
  server.use(helmet.frameguard({ action: "deny" }));
  server.use(helmet.ieNoOpen());
  server.use(helmet.noSniff());
};

export default securityMiddleware;
