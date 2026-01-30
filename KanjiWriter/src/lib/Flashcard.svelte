<script>    
    // canvas is the canvas to draw that specific kanji
    import KanjiCanvas from "./KanjiCanvas.svelte";
       // let kanji:Kanji;
    let canvas;

    let kanaPara;
    let meaningPara;
    let kanjiPara;
    let inputField;
    let word = $state("手")
    let firsttime = true;
    console.log()

</script>


<div class="flashcard">
    <input bind:this={inputField} bind:value={word} />
    <KanjiCanvas firsttime word={word} bind:this={canvas} class="kanjiCanvas"/>
    <div class="flashcardKanji">
        <div class="front">
            <p bind:this={kanaPara} class="kanjiInfo"> Kana </p>
            <p bind:this={meaningPara} class="kanjiInfo"> Meaning </p>
        </div>
        <div class="back">
            <p bind:this={kanjiPara} class="kanjiInfo" id="kanjiKanji"> Kanji</p>
        </div>
    </div>
</div>

<style>
    .kanjiCanvas {
    }

    .flashcard {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .kanjiInfo {
        display: block;
        border-color: beige;
        border-style: solid;
    }

    .flashcardKanji {
        display: flex;
        flex-direction: column;
    }


</style>