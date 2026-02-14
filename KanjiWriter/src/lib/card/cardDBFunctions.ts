import {db} from "$lib/db";
import { preprocess_kanji } from "$lib/db";
import { type AddDatabaseOperation } from "$lib/db";
import { get_deck } from "$lib/deck/deckDBFunctions";
import { get_kanji, add_kanji } from "$lib/kanji/kanjiDBFunctions";

const cardsDB = db.table("cards")

export async function get_all_cards(deck_name:string) {
    if (!deck_name) return undefined
    try { 
        const cards = await cardsDB
        .where("deck")
        .equals(deck_name)
        .toArray();
        return cards
    } catch (err) {
        console.error("Dexie get_all_cards failed: ", err);
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
            const back = render_back(kanji);
            const front = render_front(kanji);
            await db.table("cards").add({
                kanji_id: kanji.id,
                front: front,
                back: back,
                deck: deck_name,
                lastReviewDate: undefined,
                dueReviewDate: Date.now(),
                dateAdded: Date.now(),
                dateUpdated: Date.now()});
            
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

function render_card_front(kanji) {
    return kanji.kana
}

function render_card_back(kanji) {
    const back = [kanji.kanji, kanji.meaning]
}