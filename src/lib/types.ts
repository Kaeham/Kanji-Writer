export interface Card {
  id?: number;
  kanji: string;
  reading: string;
  meaning: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: number;
}
