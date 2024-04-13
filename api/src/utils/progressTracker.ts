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

export const start = (userId: string) => {
  tracker.set(userId, {
    deckbox: { total: 0, current: 0 },
    moxfield: { total: 0, current: 0 }
  });
};

export const stop = (userId: string) => {
  tracker.delete(userId);
};

export const getProgress = (userId: string) => {
  const progress = tracker.get(userId);
  return progress;
};

export const addToTotal = (userId: string, origin: Site, totalSize: number) => {
  const progress = tracker.get(userId);
  if (progress) {
    progress[origin].total += totalSize;
  }
};

export const incrementProgress = (userId: string, origin: Site) => {
  const progress = tracker.get(userId);
  if (progress && progress[origin].current < progress[origin].total) {
    progress[origin].current += 1;
  }
};

const progressTracker = {
  start, stop, getProgress, addToTotal, incrementProgress
}

export default progressTracker;