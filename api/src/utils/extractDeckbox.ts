import { Card } from "../models/Card";
import { getLastPage, scrapeDeckbox } from "./scrapper";
import logging from "./logger";
import { ExtractorArgs, ExtractorRes } from "../models/Extractors";


export const extractDeckbox = async (
  { url, urlId, progressTracker, cache }: ExtractorArgs
): Promise<ExtractorRes> => {

  const cachedCards = cache.get();
  if (cachedCards) {
    return { source: url, cards: cachedCards };
  }
  let p = 1;
  try {
    logging.info(`[SCRAPE] Deckbox started for ${url} page: ${p}`);
    const initUrl = `https://deckbox.org/sets/${urlId}?p=${p}&v=l`;
    const allCards = new Map<string, Card>();

    const resp = await fetch(initUrl);
    if (!resp.ok) {
      throw new Error(`HTTP Response Code: ${resp?.status}`);
    }
    const firstPage = await resp.text();
    const lastPage = getLastPage(firstPage);
    progressTracker.addPages('deckbox', lastPage);

    const promises = [
      scrapeDeckbox({ allCards, html: firstPage })
        .then(res => {
          progressTracker.incrementProgress("deckbox");
          return res
        })
    ];

    while (lastPage >= p) {
      const url = `https://deckbox.org/sets/${urlId}?p=${(p += 1)}&v=l`;
      promises.push(
        scrapeDeckbox({ allCards, url })
          .then(res => {
            progressTracker.incrementProgress("deckbox");
            return res
          })
      );
      logging.info(`[SCRAPE] Deckbox started for ${url} page: ${p}`);
    }

    await Promise.allSettled(promises);
    cache.set(allCards);
    return { source: url, cards: allCards };
  } catch (e: any) {
    logging.error(
      `[🔎 Extractor failed] Deckbox for ${url} page: ${p} failed with ` + e
    );
    return { source: "", cards: new Map() };
  }
};
