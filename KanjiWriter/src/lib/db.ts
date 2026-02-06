// @ts-nocheck
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

db.version(2).stores({
    deck: '++id, &name, card_count',
    cards: '++id, &kanji_id, deck, lastReviewDate, dueReviewDate',
    kanji: '++id, &kanji',
})


export async function add_kanji(input_kanji: string): Promise<AddDatabaseOperation> {
    const preprocess = preprocess_kanji(input_kanji)
    if (!preprocess.ok) {return preprocess}
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

export async function get_kanji(kanji) {
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

export async function add_card(input_kanji:string, deck_name:string): Promise<AddDatabaseOperation> {
    const preprocess = preprocess_kanji(input_kanji)
    if (!preprocess.ok) {return preprocess}
    try {
        await db.transaction("rw", 
            db.table("kanji"), db.table("cards"), db.table("deck"),
        async () => {
            const deck = await get_deck(deck_name)
            if (!deck) {throw new Error("DECK_NOT_FOUND")}
            let kanji = await get_kanji(input_kanji);
            if (!kanji) {
                const addKanji = await add_kanji(input_kanji)
                if (!addKanji.ok) {throw new Error("KANJI_CREATION_FAILED");}
                kanji = await get_kanji(input_kanji);}
            
            if (!kanji) {throw new Error("KANJI_CREATION_FAILED")}
            
            await db.table("cards").add({
                kanji_id: kanji.id,
                deck: deck_name,
                lastReviewDate: undefined,
                dueReviewDate: Date.now()});
            
            await db
            .table("deck")
            .update(deck.id, {card_count: deck.card_count + 1})
        });

        return { ok: true };
    } catch (err:any ) {
        if (err?.name === "ConstraintError") {
            return { error: "card already exists" };
        }
        if (err?.name === "DECK_NOT_FOUND") {return {error: "deck does not exist"}}
        if (err?.name === "KANJI_CREATION_FAILED") {return {error: "kanji failed to be added"}}
        console.error("add card failed", err);
        return { error: "database error"}
    }}

export async function get_deck(name:string) {
    if (!name) {return undefined}
    if (name === "*") {return await db.table("deck").toArray()}
    try {
        return await db
        .table("deck")
        .where("name")
        .equals(name)
        .first();
    } catch (err) {
        console.error("Dexie get_deck failed: ", err)
        return undefined
    }
}

export async function init_deck(name:string) {
    if (!name) {return {error: "empty name is not allowed"}}
    const deck = await get_deck(name)
    if (deck) {return {error: "a deck with that name already exists"}}
    return db.transaction("rw", db.table("deck"),
        async () => {
            await db.table("deck").add({
                name: name,
                card_count: 0})          
            }).then(() => {
                console.log("Transaction commited for deck creation")
                return {ok: true};
            }).catch(err => {
                console.error("add deck failed", err)
                return {error: "database error"}
            });
}