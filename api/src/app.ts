import Elysia from "elysia";
import { configureCardsRoutes } from "./routes/cardsRoute";
import logging from "./utils/logger";
import cors from "@elysiajs/cors";

const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .use(logging.into())
  .onError((ctx) => {
    if (ctx.code === 'VALIDATION') {
      const errDetails = JSON.parse(ctx.error.message)
      const firstErr = ctx.error.validator.Errors(ctx.error.value).First()
      return {
        code: ctx.code,
        message: 'One or more required fields are missing',
        extensions: {
          message: firstErr.message,
          source: errDetails.on,
          property: firstErr.path,
          type: firstErr.schema.type
        }
      }
    }
    return ctx.error.message
  })
  .get("/status", () => `Server is live!`)
  .group("/cards", (app) => configureCardsRoutes(app as any)); // No willpower for this "any" case. Lost hours count: 1

export default app;
