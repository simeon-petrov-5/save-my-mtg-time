import { Card } from "../models/Card";
import { getLastPage, scrapeDeckbox } from "./scrapper";
import { deckboxCache, moxfieldCache } from "./cache";
import { urlExtractor } from "./urlExtractor";
import logging from "./logger";
import { increaseUserProgressTotal, incrementUserProgress } from "./progressTracker";

export const extractDeckbox = async (
  deckboxUrl: string,
  userId:string
): Promise<{ source: string; cards: Map<string, Card> }> => {
  const id = urlExtractor(deckboxUrl);

  const cachedCards = deckboxCache.get(id);
  if (cachedCards) {
    logging.info(`[CACHE] Deckbox data for ${deckboxUrl}`);
    return { source: deckboxUrl, cards: cachedCards };
  }
  let p = 1;
  try {
    logging.info(`[SCRAPE] Deckbox started for ${deckboxUrl} page: ${p}`);
    const initUrl = `https://deckbox.org/sets/${id}?p=${p}&v=l`;
    const allCards = new Map<string, Card>();
    

    const resp = await fetch(initUrl);
    if (!resp.ok) {
      throw new Error(`HTTP Response Code: ${resp?.status}`);
    }
    const firstPage = await resp.text();
    const lastPage = getLastPage(firstPage);
    increaseUserProgressTotal(userId, 'deckbox', lastPage);

    const promises = [scrapeDeckbox({ allCards, html: firstPage, userId })];

    while (lastPage >= p) {
      const url = `https://deckbox.org/sets/${id}?p=${(p += 1)}&v=l`;
      promises.push(scrapeDeckbox({ allCards, url, userId }));
      logging.info(`[SCRAPE] Deckbox started for ${deckboxUrl} page: ${p}`);
    }

    await Promise.allSettled(promises);
    deckboxCache.set(id, allCards);
    return { source: deckboxUrl, cards: allCards };
  } catch (e: any) {
    logging.error(
      `[SCRAPE] Deckbox for ${deckboxUrl} page: ${p} failed with ` + e
    );
    return { source: "", cards: new Map() };
  }
};
