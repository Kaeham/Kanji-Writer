<style>
	#kanjiCanvas {
		border-color: black;
        border-style: solid;
	}
    .text {
        text-align: center;
        align-items: center;
    }
</style>
<script lang="ts">
    import KanjiCanvas from "$lib/KanjiCanvas.svelte";
</script>

<h1>Kanji Writer</h1>
<p> Practice your kanji writing here</p>
<div>
    <p class="text" id="kanjiKana"> kana goes here</p>
    <!-- <canvas class="text" id="kanjiCanvas" width="500" height="300"> -->
    <KanjiCanvas id={"kanjiCanvas"}/>
     <!-- </KanjiCanvas> -->
    <!-- </canvas> -->
    <p class="text" id="kanjiMeaning"> kanji meaning goes here</p>
</div>