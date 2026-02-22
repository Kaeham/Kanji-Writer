import {db} from "$lib/db";

const deckDB = db.table("deck")

export async function get_all_decks() {
    try {
        return await deckDB.toArray()
    } catch (err) {
        console.error("Dexie get_all_decks failed: ", err)
        return undefined
    }
}

export async function get_deck(name:string) {
    if (!name) {return undefined}
    try {
        if (typeof(name) === "number") {
            return (await deckDB.get(name)).name
        }
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
                card_count: 0,
                dateAdded: Date.now(),
                dateUpdated: Date.now()})          
            }).then(() => {
                console.log("Transaction commited for deck creation")
                return {ok: true};
            }).catch(err => {
                console.error("add deck failed", err)
                return {error: "database error"}
            });
}