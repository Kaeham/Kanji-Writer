<script>
    import { onMount } from "svelte";
    
    // canvas is the canvas to draw that specific kanji
    import KanjiCanvas from "$lib/canvas/KanjiCanvas.svelte";
    import { get_kanji } from "$lib/kanji/kanjiDBFunctions";
    const props = $props();
    let canvas;

    let kanaPara;
    let meaningPara;
    let kanjiPara;
    let word = $state("")
    let firsttime = $state(true);
    
    // fetching kanji information
    $effect(() => {
        if (!props.card) return;
        
        firsttime = !props.card.lastReviewDate
        console.log("firsttime: ", firsttime)
        get_kanji(props.card.kanji_id).then(res => {word = res})
        get_kanji(word).then(kanjiInfo => {
            console.log("kanjiInfo", kanjiInfo)

            try {if (kanjiInfo.kanji) {kanjiPara = kanjiInfo.kanji}} catch (err) {console.log(err.name)}
            try {if (kanjiInfo.kana) {kanaPara = kanjiInfo.kana}} catch (err) {console.log(err.name)}
            try {if (kanjiInfo.meaning) {meaningPara = kanjiInfo.meaning}} catch (err) {console.log(err.name)}

        })
        console.log("word: ", word)
    })

</script>


<div class="flashcard">
    <KanjiCanvas firsttime word={word} bind:this={canvas}/>
    <div class="flashcardKanji">
        <div class="front">
            <h3 class="kanjiInfo"> Kana </h3>
            <p class="kanjiInfo"> </p>
            <h3 class="kanjiInfo"> Meaning </h3>
        </div>
        <div class="back">
            <h3 class="kanjiInfo" id="kanjiKanji"> Kanji</h3>
        </div>
    </div>
</div>

<style>

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