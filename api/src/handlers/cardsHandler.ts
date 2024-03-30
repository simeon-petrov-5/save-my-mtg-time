// import { Context } from "elysia/dist/context";

import { Context } from "elysia";
import { extractMoxfield } from "../utils/extractMoxfield";
import { ReqBody } from "../models/ReqBody";
import { Card } from "../models/Card";
import { extractDeckbox } from "../utils/extractDeckbox";
import { CardsResp } from "../models/CardsResp";
import { Stream } from "@elysiajs/stream";

// TS - type the body?
export const postCardsHandler = async (ctx: Context) => {
  const payload = JSON.parse(ctx.body as unknown as string) as ReqBody;
  const promises: Promise<{ source: string; cards: Map<string, Card> }>[] = [];

  payload.sources.forEach((sourceUrl) => {
    if (sourceUrl.includes("moxfield.com")) {
      promises.push(extractMoxfield(sourceUrl));
    } else if (sourceUrl.includes("deckbox.org")) {
      promises.push(extractDeckbox(sourceUrl));
    }
  });

  const decksCards = await Promise.allSettled(promises);
  const result: CardsResp = {};

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

export const sseCardsHandler = (ctx: Context) => {
  return new Stream((stream) => {
    let i = 0;
    const interval = setInterval(() => {
      stream.send("hello world " + (i+=1));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      stream.close('ALL DONE');
    }, 3100);
  });
};
