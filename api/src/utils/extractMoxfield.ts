import { Card } from "../models/Card";
import { moxfieldCache } from "./cache";
import logging from "./logger";
import { urlExtractor } from "./urlExtractor";

export const extractMoxfield = async (
  moxUrl: string
): Promise<{ source: string; cards: Map<string, Card> }> => {
  const id = urlExtractor(moxUrl);

  const cachedCards = moxfieldCache.get(id);
  if (cachedCards) {
    logging.info(`[CACHE] Moxfield data for ${moxUrl}`);
    return { source: moxUrl, cards: cachedCards };
  }
  try {
    logging.info(`[SCRAPE] Moxfield started for ${moxUrl}`);
    const resp = await fetch(`https://api2.moxfield.com/v3/decks/all/${id}`);
    if (!resp.ok) {
      throw new Error(`HTTP Response Code: ${resp?.status}`);
    }
    const data = await resp.json();

    // const cardsList: Card[] = [];
    const allCards = new Map<string, Card>();

    for (const boardType in data.boards) {
      const { cards } = data.boards[boardType];

      for (const cardId in cards) {
        const entry = cards[cardId];

        const existing = allCards.get(entry.card.name);
        if (existing) {
          existing.count += entry.quantity;
        } else {
          const newCard: Card = {
            id: cardId,
            name: entry.card.name,
            count: entry.quantity,
            imgUrl: `https://assets.moxfield.net/cards/card-${cardId}-normal.webp`,
          };
          allCards.set(entry.card.name, newCard);
        }
      }
    }
    moxfieldCache.set(id, allCards);
    return { source: moxUrl, cards: allCards };
  } catch (e: any) {
    // console.log("ERR Moxfield", e.message);
    logging.error(`[SCRAPE] Moxfield for ${moxUrl} failed with ` + e);
    return { source: moxUrl, cards: new Map() };
  }
};
