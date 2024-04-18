import { CrawlerCache } from "../utils/cache";
import { ProgressTracker } from "../utils/progressTracker";
import { Card } from "./Card";

export type ExtractorArgs = {
    url: string,
    urlId: string;
    progressTracker: ProgressTracker,
    cache: CrawlerCache
}

export type ExtractorRes = {
    source: string;
    cards: Map<string, Card>
}