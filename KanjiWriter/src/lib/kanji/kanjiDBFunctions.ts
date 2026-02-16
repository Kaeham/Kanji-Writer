import { db } from "$lib/db";
import { preprocess_kanji, type AddDatabaseOperation } from "$lib/db";
import { kanji_to_kana, get_kanji_meaning } from "$lib/Kanji";

export async function add_kanji(input_kanji: string): Promise<AddDatabaseOperation> {
    const preprocess = preprocess_kanji(input_kanji)
    if (!preprocess.ok) {return preprocess}
    try {
        await db.transaction("rw", db.table("kanji"),
        async () => {
            const kana = await kanji_to_kana(input_kanji);
            const meaning = await get_kanji_meaning(input_kanji);
            await db.table("kanji").add({
                kanji: input_kanji,
                kana: kana,
                meaning: meaning,
                dateAdded: Date.now(),
                dateUpdated: Date.now()
            })
            return { ok: true}
        })
    } catch (err: any) {
        if (err?.name === "ConstraintError") {
            return {error: "Kanji has already been added!"}
        }
        console.error(err)
        return { error: "database error"}
    }
}

export async function get_kanji(kanji: string) {
    if (!kanji) return undefined
    try {
        if (typeof(kanji) === "number") {
            return await db.table("kanji")
            .get(kanji)
        } else {return await db
        .table("kanji")
        .where("kanji")
        .equals(kanji)
        .first();}
    } catch (err) {
        console.error("Dexie get_kanji failed: ", err);
        return undefined
    }
}