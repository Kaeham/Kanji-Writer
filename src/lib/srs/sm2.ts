export interface ReviewResult {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: number; // timestamp
}

export function sm2(
  quality: number, 
  prev: ReviewResult
): ReviewResult {
  let { interval, easeFactor, repetitions } = prev;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    repetitions++;
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * 0.08);
  }

  return {
    interval,
    easeFactor,
    repetitions,
    nextReview: Date.now() + interval * 24 * 60 * 60 * 1000
  };
}
