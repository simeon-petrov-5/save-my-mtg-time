import Elysia from "elysia";
import { postCardsHandler } from "../handlers/cardsHandler";

export function configureCardsRoutes(app: Elysia) {
  return app.post("/", postCardsHandler);
}
