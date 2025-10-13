import Dexie, { type Table } from 'dexie';
import type { Card } from './types';

export class KanjiDB extends Dexie {
  cards!: Table<Card, number>;

  constructor() {
    super('KanjiDB');
    this.version(1).stores({
      cards: '++id, kanji, reading, meaning, nextReview'
    });
  }
}

export const db = new KanjiDB();
