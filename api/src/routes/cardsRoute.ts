import Elysia, { error, t } from "elysia";
import { postCardsHandler, sseCardsHandler } from "../handlers/cardsHandler";
import { ReqBodySchema } from "../models/ReqBody";

export function configureCardsRoutes(app: Elysia) {
  return app
    .post("/", (context) => {
      const userId = context.query.userId;
      const payload = context.body;
      return postCardsHandler(userId, payload)
    }, {
      query: t.Object({
        userId: t.String()
      }),
      body: ReqBodySchema
    })
    .get('/sse', (context) => {
      const userId = context.query.userId;
      return sseCardsHandler(userId)
    }, {
      query: t.Object({
        userId: t.String()
      })
    })
}
