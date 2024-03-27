import { lru } from "tiny-lru";


export const moxfieldCache = lru(50, 5 * 60 * 1000);
export const deckboxCache = lru(10, 30 * 60 * 1000);