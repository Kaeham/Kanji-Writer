<script>
    // @ts-nocheck
    import { db } from "$lib/db";
    import { get_kanji } from "$lib/kanji/kanjiDBFunctions";
    import { add_card } from "./cardDBFunctions";
    import DeckSelector from "$lib/deck/deckSelector.svelte";
    let inputKanji = $state("");
    let dbKanji = $state("");
    let submitButton;
    
    let selectedDeck = $state(null);

    function deckHandle(deck) {
        selectedDeck = deck;
        console.log("selected deck:", selectedDeck)
    }
    
    $effect(() => {
        if (!inputKanji) {
            dbKanji = "";
            return;}
        get_kanji(inputKanji).then(result => {
        dbKanji = result?.kanji ?? "Not Found"});
    });

</script>


<div>
    <p class="page">Add Card</p>
    <input type="input" bind:value={inputKanji}>
    <DeckSelector onSelect={deckHandle}/>
    <button bind:this={submitButton} onclick={() => add_card(inputKanji, selectedDeck)}>Submit</button>
    <!-- <button onclick={showdb}>Show</button>
    <button onclick={() => get_kanji(inputKanji)}>Check Kanji</button> -->
</div>

<style>
    .page {
        background-color: darkslategrey;
        width: 100%;
        height: 100%;
        display: block;
    }
</style>