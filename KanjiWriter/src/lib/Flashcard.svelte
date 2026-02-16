<script>
    import { onMount } from "svelte";
    
    // canvas is the canvas to draw that specific kanji
    import KanjiCanvas from "./KanjiCanvas.svelte";
    import { get_kanji } from "./kanji/kanjiDBFunctions";
    const props = $props();
    let canvas;

    let kanaPara;
    let meaningPara;
    let kanjiPara;
    let word = $state("")
    let firsttime = $state(true);
    
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
            <p bind:this={kanaPara} class="kanjiInfo"> Kana </p>
            <p bind:this={meaningPara} class="kanjiInfo"> Meaning </p>
        </div>
        <div class="back">
            <p bind:this={kanjiPara} class="kanjiInfo" id="kanjiKanji"> Kanji</p>
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