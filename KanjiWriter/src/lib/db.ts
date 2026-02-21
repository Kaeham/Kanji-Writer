// @ts-nocheck
import Dexie from "dexie";

export const db = new Dexie("kanji-db")
const nonJapaneseRegex =
    /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々]/u
export type AddDatabaseOperation = 
    | { ok: true }
    | { error: string};

export function preprocess_kanji(input_kanji:string): AddDatabaseOperation {
    if (!input_kanji) {return {error: "empty input"}}
    if (nonJapaneseRegex.test(input_kanji)) {return {error: "non japanese characters found"}}
    return { ok: true}
}

db.version(4).stores({
    deck: '++id, &name, card_count, dateAdded, dateUpdated',
    cards: '++id, &kanji_id, &deck_id, front, back, lastReviewDate, dueReviewDate, dateAdded, dateUpdated',
    kanji: '++id, &kanji, kana, meaning, dateAdded, dateUpdated',
    srs: '++id, &card_id, interval, repetitions, easeFactor',
})