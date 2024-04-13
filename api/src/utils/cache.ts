import { LRU, lru } from "tiny-lru";
import { Site, Sites } from "../constants/sites";
import { Card, UserCards } from "../models/Card";
import logging from "./logger";

const cache: { [key in Site]: LRU<UserCards> } = {
    moxfield: lru<UserCards>(50, 5 * 60 * 1000),
    deckbox: lru<UserCards>(10, 30 * 60 * 1000)
}


const urlExtractor = (url: string) => {
    const link = new URL(url);
    let pathToRemove = "";
    if (url.includes("moxfield.com")) {
        pathToRemove = "/decks/";
    } else if (url.includes("deckbox.org")) {
        pathToRemove = "/sets/";
    }
    return link.pathname.replace(pathToRemove, "");
};

export class CrawlerCache {
    origin: Site;
    url: string;
    urlId: string;

    constructor(origin: Site, url: string, urlId:string) {
        this.origin = origin;
        this.url = url;
        this.urlId = urlId;
    }

    set(data: UserCards) {
        cache[this.origin].set(this.urlId, data);
        logging.info(`[ 💾 CACHE CREATED ] ${this.origin} ${this.urlId}`);
    }
    get() {
        const found = cache[this.origin].get(this.urlId);
        if (found) {
            logging.info(`[ 💾 CACHE RETRIEVED ] ${this.origin} ${this.urlId}`);
            return found
        }
        return null
    }
}