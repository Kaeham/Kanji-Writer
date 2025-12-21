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

// <div class="Kanji">
//     <!-- <button onclick={() => extractKanjiInfo()}>
//         Press for request
//     </button> -->
// </div>

// <style>
//     .Kanji {
//         border-color: blue;
//         border-style: solid;   
//     }
// </style>