<script>
    // @ts-nocheck
    import { db, get_deck } from "$lib/db";
    import NewDeck from "$lib/deck/newDeck.svelte";
    import { onMount } from "svelte";
    import DeckView from "$lib/deck/deckView.svelte";

    let allDecks = $state([]);
    let currentSelection = $state("");
    let selectedDeck = $derived(currentSelection);
    
    $effect( async () => {
        console.log(currentSelection)
        if (allDecks) {$inspect(allDecks).with(console.log)}
        
    });
    
    onMount(async () => {
        const decks = await get_deck("*")
        decks.forEach(element => {
            allDecks.push(element.name)
        });
        
    });
    
</script>


<div id="deckSelector">
    <select id="deckSelectList" bind:value={currentSelection}>
        <option value="" selected></option>
        <option value="newDeck">Create New Deck</option>
        {#each allDecks as name}
            <option value={name}>{name}</option>
        {/each}
    </select>
</div>
<div id="deckViewer">
    {#if selectedDeck === "newDeck"}
        <NewDeck />
    {:else if selectedDeck !== ""}
        <DeckView />
    {/if}
</div>

<style>
</style>




