// import { Context } from "elysia/dist/context";

import { Context } from "elysia";
import { extractMoxfield } from "../utils/extractMoxfield";
import { ReqBody } from "../models/ReqBody";
import { Card } from "../models/Card";
import { extractDeckbox } from "../utils/extractDeckbox";

// TS - type the body?
export const postCardsHandler = async (ctx: Context) => {
  const payload = ctx.body as ReqBody;
  const promises: Promise<{ source: string; cards: Map<string, Card> }>[] = [];

  payload.sources.forEach((sourceUrl) => {
    if (sourceUrl.includes("moxfield.com")) {
      promises.push(extractMoxfield(sourceUrl));
    } else if (sourceUrl.includes("deckbox.org")) {
      promises.push(extractDeckbox(sourceUrl));
    }
  });

  const decksCards = await Promise.allSettled(promises);
  const result: { [k: string]: Card[] } = {};

  payload.cards.forEach((cardName) => {
    decksCards.forEach((promise) => {
      if (promise.status === "fulfilled") {
        const existing = promise.value.cards.get(cardName);
        if (existing) {
          if (!result[promise.value.source]) {
            result[promise.value.source] = [];
          }
          result[promise.value.source].push(existing);
        }
      }
    });
  });
  ctx.set.status = 200;
  return result;
};
