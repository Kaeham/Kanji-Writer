import Dexie from "dexie";

export const db = new Dexie("kanji-db")
const nonJapaneseRegex =
    /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々]/u

db.version(1).stores({
    cards: '++id, &kanji_id, lastReviewDate, dueReviewDate',
    kanji: '++id, &kanji',
})


export async function add_kanji(input_kanji: string) {
    if (nonJapaneseRegex.test(input_kanji)) {return {error: "non japanese characters found!"}}
    if (!input_kanji) {return {error: "empty input"}}
    try {
        await db.table("kanji").add({kanji: input_kanji})
        return { ok: true}
    } catch (err: any) {
        if (err?.name === "ConstraintError") {
            return {error: "Kanji ahs already been added!"}
        }
        console.error(err)
        return { error: "database error"}
    }
}

async function get_kanji(kanji:string) {
    if (!kanji) return undefined
    try {
        return await db
        .table("kanji")
        .where("kanji")
        .equals(kanji)
        .first();
    } catch (err) {
        console.error("Dexie get_kanji failed:", err);
        return undefined
    }
}