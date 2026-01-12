<script lang="ts">    
    // canvas is the canvas to draw that specific kanji
    import KanjiCanvas from "./KanjiCanvas.svelte";
    import type { CardDifficulty } from "./FlashcardLogic";

    // let kanji:Kanji;
    let canvas:KanjiCanvas;

    let kanaPara:HTMLParagraphElement;
    let meaningPara:HTMLParagraphElement;

    let firstTime: boolean = true;
    const difficulty:CardDifficulty = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3}

</script>


<div class="text">
    <p> top of the flashcard </p>
    <!-- <Kanji kanji="高校" bind:this={kanji}/> -->
    <KanjiCanvas firsttime difficulty bind:this={canvas}/>
    <p> bottom of the flashcard </p>
</div>

<style>
</style>