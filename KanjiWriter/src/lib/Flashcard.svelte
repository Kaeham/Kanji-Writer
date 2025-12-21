<script lang="ts">    
    // kanji is the representation of the kanji
    import Kanji from "./Kanji.svelte";
    // canvas is the canvas to draw that specific kanji
    import KanjiCanvas from "./KanjiCanvas.svelte";

    let kanji:Kanji;
    let canvas:KanjiCanvas;

    let showButton;
    let againButton;
    let hardButton;
    let goodButton;
    let easyButton;

    let kanaPara:HTMLParagraphElement;
    let meaningPara:HTMLParagraphElement;
    
    // function showKanji() {

    // }

</script>


<div class="text">
    <p> top of the flashcard </p>
    <Kanji kanji="高校" bind:this={kanji}/>
    <KanjiCanvas kanji={kanji} bind:this={canvas}/>

    <div id="answerButton">
        <button 
        class="answerButton"
        id="showKanjiButton" 
        bind:this={showButton}
        onclick={() => canvas.toggleCanvas()}
        >
        Show Kanji</button>
    </div>
    <div id="resultButtons">
        <button class="answerButton" id="againAnswerButton" bind:this={againButton}>Again</button>
        <button class="answerButton" id="hardAnswerButton" bind:this={hardButton}>Hard</button>
        <button class="answerButton" id="goodAnswerButton" bind:this={goodButton}>Good</button>
        <button class="answerButton" id="easyAnswerButton" bind:this={easyButton}>Easy</button>
    </div>
    <p> bottom of the flashcard </p>
</div>

<style>
    #answerButton {
        display: block;
        border-color: green;
        border-style: solid;          
    }
    #resultButtons {
        display: block;
        border-color: cyan;
        border-style: solid;          
    }
</style>