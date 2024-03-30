import Elysia from "elysia";
import { postCardsHandler, sseCardsHandler } from "../handlers/cardsHandler";

export function configureCardsRoutes(app: Elysia) {
  return app.post("/", postCardsHandler).get('/sse', sseCardsHandler)
}
