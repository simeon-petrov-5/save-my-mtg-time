import Elysia from "elysia";
import { configureCardsRoutes } from "./routes/cardsRoute";
import { logger } from "@bogeychan/elysia-logger";
import logging from "./utils/logger";

const app = new Elysia({ prefix: '/api' })
  .use(logging.into())
  .get("/status", () => `Server is live!`)
  .group("/cards", configureCardsRoutes);

export default app;
