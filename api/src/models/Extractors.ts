import { CrawlerCache } from "../utils/cache";
import { ProgressTracker } from "../utils/progressTracker";

export type ExtractorArgs = {
    url: string,
    urlId: string;
    progressTracker: ProgressTracker,
    cache: CrawlerCache
}