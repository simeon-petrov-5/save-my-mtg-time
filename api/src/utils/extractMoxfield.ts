import { Card } from "../models/Card";
import { moxfieldCache } from "./cache";
import logging from "./logger";
import { increaseUserProgressTotal, incrementUserProgress } from "./progressTracker";
import { urlExtractor } from "./urlExtractor";

export const extractMoxfield = async (
  moxUrl: string,
  userId: string
): Promise<{ source: string; cards: Map<string, Card> }> => {
  const id = urlExtractor(moxUrl);

  const cachedCards = moxfieldCache.get(id);
  if (cachedCards) {
    logging.info(`[CACHE] Moxfield data for ${moxUrl}`);
    return { source: moxUrl, cards: cachedCards };
  }
  try {
    logging.info(`[SCRAPE] Moxfield started for ${moxUrl}`);
    increaseUserProgressTotal(userId, 'moxfield', 1);
    const resp = await fetch(`https://api2.moxfield.com/v3/decks/all/${id}`);
    if (!resp.ok) {
      throw new Error(`HTTP Response Code: ${resp?.status}`);
    }
    const data = await resp.json();

    // const cardsList: Card[] = [];
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
    incrementUserProgress(userId, "moxfield");
    moxfieldCache.set(id, allCards);
    return { source: moxUrl, cards: allCards };
  } catch (e: any) {
    logging.error(`[SCRAPE] Moxfield for ${moxUrl} failed with ` + e);
    return { source: moxUrl, cards: new Map() };
  }
};
