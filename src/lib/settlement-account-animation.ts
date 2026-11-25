export const settlementChapters = ['shared', 'separate'] as const;
export type SettlementChapter = (typeof settlementChapters)[number];

const sharedTiming = { duration: 4900, ownStart: 450, ownEnd: 1200, crossStart: 1500, crossEnd: 2400 };
const separateTiming = { duration: 3900, confirmation: 650 };
const chapterTimings = { shared: sharedTiming, separate: separateTiming };

export const settlementChapterDuration = (chapter: SettlementChapter) => chapterTimings[chapter].duration;

export const nextSettlementChapter = (chapter: SettlementChapter) =>
  settlementChapters[(settlementChapters.indexOf(chapter) + 1) % settlementChapters.length];

const travelProgress = (elapsed: number, start: number, end: number) => {
  const progress = Math.max(0, Math.min(1, (elapsed - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
};

export const getSettlementChapterFrame = (chapter: SettlementChapter, elapsed: number) => {
  if (chapter === 'shared') {
    const { ownStart, ownEnd, crossStart, crossEnd } = sharedTiming;
    return {
      phase: elapsed < ownStart ? 0 : elapsed < crossEnd ? 1 : 2,
      delivered: elapsed >= crossEnd,
      crossUse: elapsed >= crossStart,
      firstTile: travelProgress(elapsed, ownStart, ownEnd),
      secondTile: travelProgress(elapsed, crossStart, crossEnd),
    };
  }

  const delivered = elapsed >= separateTiming.confirmation;
  return { phase: delivered ? 2 : 0, delivered, crossUse: false, firstTile: 0, secondTile: 0 };
};
