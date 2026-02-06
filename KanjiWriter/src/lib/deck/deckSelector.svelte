<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { db, get_deck } from "$lib/db";
    import DeckView from "$lib/deck/deckView.svelte";
    import NewDeck from "./newDeck.svelte";
    import DeckSelector from "$lib/deck/deckSelector.svelte";

    let allDecks = $state([]);
    let { onSelect } = $props();
    let currentSelection = $state("");
    let selectedDeck = $state(null)

    $effect(() => {
        if (allDecks) {$inspect(allDecks).with(console.log)}
        console.log(currentSelection)

        if (!currentSelection || currentSelection === "newDeck") {
            selectedDeck
            return;
        }

        get_deck(currentSelection).then(deck => {
            selectedDeck = deck;
        });
    });

    onMount(async () => {
        const decks = await get_deck("*")
        allDecks = decks.map(d =>d.name)
    });
</script>


<select bind:value={currentSelection}
    onchange={() => onSelect?.(currentSelection)}
>
        <option value="" selected></option>
        <option value="newDeck">Create New Deck</option>

        {#each allDecks as name}
            <option value={name}>{name}</option>
        {/each}
</select>

<!-- extract this out later -->
<div id="deckViewer">
    {#if currentSelection === "newDeck"}
        <NewDeck />
    {:else if selectedDeck}
        <DeckView deck={selectedDeck}/>
    {/if}
</div>