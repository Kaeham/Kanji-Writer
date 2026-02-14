<script>
    // @ts-nocheck
    import { db } from "$lib/db";
    import { get_kanji, add_kanji } from "./kanjiDBFunctions";

    import DeckSelector from "$lib/deck/deckSelector.svelte";
    let inputKanji = $state("");
    let dbKanji = $state("");
    let submitButton;
    
    // let { data } = $props();
    function showdb() {console.log(db.tables)};
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
    <p class="page">Add Kanji</p>
    <p contenteditable="true" bind:innerText={dbKanji}></p>
    <input type="input" bind:value={inputKanji}>
    <button bind:this={submitButton} onclick={() => add_kanji(inputKanji)}>Submit</button>
    <button onclick={showdb}>Show</button>
    <button onclick={() => get_kanji(inputKanji)}>Check Kanji</button>
</div>

<style>
    .page {
        background-color: darkslategrey;
        width: 100%;
        height: 100%;
        display: block;
    }
</style>