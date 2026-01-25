import Dexie from "dexie";

export const db = new Dexie("kanji-db")

db.version(1).stores({
    cards: '++id, &kanji_id, lastReviewDate, dueReviewDate',
    kanji: '++id, &kanji',
})


export async function add_kanji(input_kanji: string) {
    if (await get_kanji(input_kanji)) {return {"error": "kanji has already been added"}}
    db.table("kanji").add({kanji: input_kanji})
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