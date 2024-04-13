// import { Context } from "elysia/dist/context";

import { Context } from "elysia";
import { extractMoxfield } from "../utils/extractMoxfield";
import { ReqBody } from "../models/ReqBody";
import { Card } from "../models/Card";
import { extractDeckbox } from "../utils/extractDeckbox";
import { CardsResp } from "../models/CardsResp";
import { Stream } from "@elysiajs/stream";
import { ProgressTracker } from "../utils/progressTracker";
import { CrawlerCache } from "../utils/cache";
import { urlExtractor } from "../utils/urlExtractor";


export const postCardsHandler = async (userId: string, payload: ReqBody) => {
  const progressTracker = new ProgressTracker(userId);
  progressTracker.start();

  const promises: Promise<{ source: string; cards: Map<string, Card> }>[] = [];

  payload.sources.forEach((url) => {
    const urlId = urlExtractor(url)

    if (url.includes("moxfield.com")) {
      const cache = new CrawlerCache("moxfield", url, urlId)
      promises.push(extractMoxfield({ url, urlId, progressTracker, cache }));
    } else if (url.includes("deckbox.org")) {
      const cache = new CrawlerCache("deckbox", url, urlId)
      promises.push(extractDeckbox({ url, urlId, progressTracker, cache }));
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

  progressTracker.stop();
  return result;
};

export const sseCardsHandler = (userId: string) => {
  const progressTracker = new ProgressTracker(userId)

  return new Stream((stream) => {
    const interval = setInterval(() => {
      const progress = progressTracker.getProgress();
      if (progress) {
        stream.send(JSON.stringify(progress));
      } else {
        clearInterval(interval);
        stream.close();
      }
    }, 500);
  });
};
