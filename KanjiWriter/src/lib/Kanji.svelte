<script lang="ts">
    import { onMount } from "svelte";
    import { logKanji } from "./kanjiMethods";
    let { kanji } = $props()
    let extractedKanji: unknown[] = [];

    async function extractKanjiInfo() {
        const result:any = await logKanji(kanji)
        extractedKanji = result
    }

    export function getKanjiInfo(): unknown[] {
        return extractedKanji;
    }

    onMount(() => {
        extractKanjiInfo()
    })

</script>

<div class="Kanji">
    <!-- <button onclick={() => extractKanjiInfo()}>
        Press for request
    </button> -->
</div>

<style>
    .Kanji {
        border-color: blue;
        border-style: solid;   
    }
</style>