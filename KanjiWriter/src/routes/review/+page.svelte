<script>
    // @ts-nocheck
    import { get_all_cards } from "$lib/card/cardDBFunctions";
    import { db } from "$lib/db";
    import Flashcard from "$lib/Flashcard.svelte";
    import { onMount } from "svelte";
    const deck = "Test";
    const now = Date.now();
    let reviewCards = $state([]);
    let ceil = $derived(reviewCards.length)
    let currentCard = $state();

    function random_review(max) {
        const idx = Math.floor(Math.random() * max)
        currentCard = reviewCards.at(idx)
    }
    
    onMount(async () => {
        const cards = await get_all_cards(deck)
        cards?.map(card => {
            if (card.dueReviewDate <= now) {
                reviewCards.push(card)
            }
        })
        random_review(ceil)
        console.log(currentCard)
    })

    $effect( () => {
        random_review(ceil)
    })

</script>


<div class="page">
    <Flashcard card={currentCard}></Flashcard>
</div>

<style>
    .page {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>




