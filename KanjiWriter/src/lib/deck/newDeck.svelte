<script>
    import { init_deck } from "$lib/db";
    let deckName = $state("")

</script>

<div>
    <!-- <input type="text" bind:value={deckName}>
    <button onclick={() => {console.log(init_deck(deckName))}}> Create (+) </button> -->
    <input type="text" bind:value={deckName} class="deckNameInput">
    <button 
        class="createDeckButton"
        onclick={ async () => {
            try {
                const result = await init_deck(deckName)
                console.log(result)
            } catch (err) {console.error(err)}
            }} 
        > Create (+) </button>
</div>

<style>

</style>