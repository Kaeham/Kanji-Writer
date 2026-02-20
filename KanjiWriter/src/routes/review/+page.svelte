<script>
    // @ts-nocheck
    import { get_all_cards } from "$lib/card/cardDBFunctions";
    import { db } from "$lib/db";
    import DeckSelector from "$lib/deck/deckSelector.svelte";
    import Flashcard from "$lib/Flashcard.svelte";
    import { onMount } from "svelte";

    let now = $state(Date.now());
    let reviewCards = $state([]);
    let currentDeck = $state();
    let currentCard = $state();

    setInterval(() => {
        now = Date.now()
    }, 300_000);

    function random_review() {
        const idx = Math.floor(Math.random() * reviewCards.length)
        currentCard = reviewCards[idx]
    }

    function deck_handle(selected_deck) {
        currentDeck = selected_deck
        console.log("current deck: ", currentDeck)
    }

    // update current deck
    $effect( () => {
        if (!currentDeck) return;

        get_all_cards(currentDeck).then(cards => {
            reviewCards = cards.filter(
                card => card.dueReviewDate <= now
            )
        })
    })

    // update current review card
    $effect(() => {
        if (!reviewCards.length) return;
        if (currentCard) return;

        random_review(ceil)
    })

</script>


<div class="page">
    <DeckSelector onSelect={deck_handle} selector={true}></DeckSelector>
    <Flashcard card={currentCard}></Flashcard>
</div>

<style>
    .page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>