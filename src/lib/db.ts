import Dexie, { type Table } from 'dexie';
import type { Card } from './types';

export class KanjiDB extends Dexie {
    cards!: Table<Card, number>;

    constructor() {
        super('KanjiDB');
        this.version(1).stores({
        cards: '++id, kanji, reading, meaning, nextReview'});
    }
}

export const db = new KanjiDB();
// temp seed for testing

await db.cards.bulkPut([
{
    kanji: '書',
    reading: 'しょ',
    meaning: 'write',
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now()},
    
{
    kanji: '食',
    reading: 'しょく',
    meaning: 'eat',
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now()}
]);
