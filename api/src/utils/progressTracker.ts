import { Site } from "../constants/sites";

const tracker = new Map<string, { [key in Site]: { total: number; current: number } }>();

export class ProgressTracker {
  private userId;

  constructor(userId: string) {
    this.userId = userId
  }


  start = () => {
    tracker.set(this.userId, {
      deckbox: { total: 0, current: 0 },
      moxfield: { total: 0, current: 0 }
    });
  };

  stop = () => {
    tracker.delete(this.userId);
  };

  getProgress = () => {
    return tracker.get(this.userId);
  };

  addPages = (origin: Site, totalSize: number) => {
    const progress = tracker.get(this.userId);
    if (progress) {
      progress[origin].total += totalSize;
    }
  };

  incrementProgress = (origin: Site) => {
    const progress = tracker.get(this.userId);
    if (progress && progress[origin].current < progress[origin].total) {
      progress[origin].current += 1;
    }
  };
}