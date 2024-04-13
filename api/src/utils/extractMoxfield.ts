import { Card } from "../models/Card";
import { ExtractorArgs } from "../models/Extractors";
import logging from "./logger";



export const extractMoxfield = async (
  { url, urlId, progressTracker, cache }: ExtractorArgs
): Promise<{ source: string; cards: Map<string, Card> }> => {

  const cachedCards = cache.get();
  if (cachedCards) {
    return { source: url, cards: cachedCards };
  }
  try {
    logging.info(`[SCRAPE] Moxfield started for ${url}`);
    progressTracker.addPages('moxfield', 1);

    const resp = await fetch(`https://api2.moxfield.com/v3/decks/all/${urlId}`);
    if (!resp.ok) {
      throw new Error(`HTTP Response Code: ${resp?.status}`);
    }
    const data = await resp.json();
    const allCards = new Map<string, Card>();

    for (const boardType in data.boards) {
      const { cards } = data.boards[boardType];

      for (const uniqueCardId in cards) {
        const entry = cards[uniqueCardId];

        const existing = allCards.get(entry.card.name);
        if (existing) {
          existing.count += entry.quantity;
        } else {
          const newCard: Card = {
            id: entry.card.id,
            name: entry.card.name,
            count: entry.quantity,
            imgUrl: `https://assets.moxfield.net/cards/card-${entry.card.id}-normal.webp`,
          };
          allCards.set(entry.card.name, newCard);
        }
      }
    }
    progressTracker.incrementProgress("moxfield");
    cache.set(allCards);
    return { source: url, cards: allCards };
  } catch (e: any) {
    logging.error(`[SCRAPE] Moxfield for ${url} failed with ` + e);
    return { source: url, cards: new Map() };
  }
};
