<script>
    // @ts-nocheck
    import { get_kanji } from "$lib/kanji/kanjiDBFunctions";
    import { get_deck } from "./deckDBFunctions";
    import { onMount } from "svelte";
    import { get_all_cards } from "$lib/card/cardDBFunctions";

    let {deck} = $props()
    $inspect(deck).with(console.log)
    let cards = $state([])

    async function preprocessCards(deck_name) {
        const rawCards = await get_all_cards(deck_name);

        const enriched = await Promise.all(
            rawCards.map( async (card) => {
                const kanji = await get_kanji(card.kanji_id);

                return {
                    ...card,
                    kanji: kanji?.kanji ?? "Failed",
                    dueReviewDate: new Date(card.dueReviewDate).toLocaleString()
                };
            })
        );
        cards = enriched;
    }

    $effect(() => {
        preprocessCards(deck.name)
    })
</script>


<div class="deck">
    <div class="deckTitles">
        <p>{deck.name}</p>
    </div>
    <div class="deckContent">
        <div class="deckTitles">
            <p class="tableTitles">Kanji</p>
            <p class="tableTitles">Deck</p>
            <p class="tableTitles">Review Date</p>
        </div>
        {#each cards as card}
        <div class="tableRows">
            <p class="rowContent">{card.kanji}</p>    
            <p class="rowContent">{card.deck}</p>    
            <p class="rowContent">{card.dueReviewDate}</p>
        </div>
        {/each}
    </div>
</div>

<style>
    .deckTitles {
        border: 1px;
        border-style: solid;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .tableTitles {
        border: 0px 0px 0px 0px;
        border-style: solid;
        height: 100%;
        width: 100%;
        display: inherit;
        justify-content: center;
    }

    .tableRows {
        display: flex;
        flex-direction: row;
    }

    .rowContent {
        border: 1px;
        border-style: solid;
        border-color: gray;
        border-radius: 0px;
        width: 100%;
        padding: 5px 0px 5px 5px;
    }

</style>