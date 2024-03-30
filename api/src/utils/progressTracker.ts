import { Site } from "../constants/sites";

const progressTracker = new Map<string, {[key in Site]:{ total: number; current: number }}>();

export const initUserProgress = (userId: string) => {
  progressTracker.set(userId, {
    deckbox:{ total: 0, current: 0 },
    moxfield:{ total: 0, current: 0 }
  });
};


export const getUserProgress = (userId: string) => {
  const progress = progressTracker.get(userId);
  return progress;
};

export const cleanUserProgress = (userId: string) => {
  progressTracker.delete(userId);
};

export const increaseUserProgressTotal = (userId: string, origin:Site, totalSize:number) => {
    const progress = progressTracker.get(userId);
    if (progress) {
      progress[origin].total += totalSize;
    }
  };

export const incrementUserProgress = (userId: string, origin:Site) => {
  const progress = progressTracker.get(userId);
  if (progress && progress[origin].current < progress[origin].total) {
    progress[origin].current += 1;
  }
};
