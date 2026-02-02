<script>
    import { get_deck } from "$lib/db";
    import { onMount } from "svelte";

    let {deck} = $props()

</script>


<div class="deck">
    <div class="deckTitles">
        <p>name: {deck.name}</p>
        <p>count: {deck.card_count}</p>
    </div>
    <div class="deckContent">
        <!-- {#each deck as element}
        <p>{element}</p>
        {/each} -->
    </div>
</div>

<style></style>