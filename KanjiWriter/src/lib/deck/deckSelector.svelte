<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { get_all_decks, get_deck } from "./deckDBFunctions";
    import DeckView from "$lib/deck/deckView.svelte";
    import NewDeck from "./newDeck.svelte";

    let allDecks = $state([]);
    let { onSelect, selector } = $props();
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
        const decks = await get_all_decks()
        if (decks) { allDecks = decks.map(d =>d.name) }
    });
</script>


<select bind:value={currentSelection}
    onchange={() => onSelect?.(currentSelection)}
>       
    <option value="" selected></option>
    {#if !selector}
        <option value="newDeck">Create New Deck</option>
    {/if}
    {#each allDecks as name}
        <option value={name}>{name}</option>
    {/each}
</select>

<!-- extract this out later -->
 {#if !selector}
    <div id="deckViewer">
        {#if currentSelection === ""}
            <div></div>
        {:else if currentSelection === "newDeck"}
            <NewDeck />
        {:else if selectedDeck}
            <DeckView deck={selectedDeck}/>
        {/if}
    </div>
{/if}