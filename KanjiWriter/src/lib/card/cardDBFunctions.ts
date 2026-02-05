import {db} from "$lib/db";
import KanjiCanvas from "$lib/KanjiCanvas.svelte";

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