import Dexie from "dexie";

export const db = new Dexie("kanji-db")
const nonJapaneseRegex =
    /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々]/u
type AddDatabaseOperation = 
    | { ok: true }
    | { error: string};

function preprocess_kanji(input_kanji:string): AddDatabaseOperation {
    if (!input_kanji) {return {error: "empty input"}}
    if (nonJapaneseRegex.test(input_kanji)) {return {error: "non japanese characters found"}}
    return { ok: true}
}

db.version(1).stores({
    cards: '++id, &kanji_id, lastReviewDate, dueReviewDate',
    kanji: '++id, &kanji',
})


export async function add_kanji(input_kanji: string): Promise<AddDatabaseOperation> {
    if (!input_kanji) {return {error: "empty input"}}
    if (nonJapaneseRegex.test(input_kanji)) {return {error: "non japanese characters found!"}}
    try {
        await db.table("kanji").add({kanji: input_kanji})
        return { ok: true}
    } catch (err: any) {
        if (err?.name === "ConstraintError") {
            return {error: "Kanji has already been added!"}
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

export async function add_card(input_kanji:string): Promise<AddDatabaseOperation> {
    const preprocess = preprocess_kanji(input_kanji)
    if (!preprocess.ok) {return preprocess}
    try {
        let kanji = await get_kanji(input_kanji);
        if (!kanji) {
            const addKanji = await add_kanji(input_kanji)
            if (!addKanji.ok) {return addKanji}
            kanji = await get_kanji(input_kanji);
        }

        await db.table("cards").add({
            kanji_id: kanji.id,
            lastReviewDate: undefined,
            dueReviewDate: Date.now()});
            return { ok: true };
    } catch (err:any ) {
        if (err?.name === "ConstraintError") {
            return { error: "card already exists" };
        }
        console.error("add card failed", err);
        return { error: "database error"}
    }}