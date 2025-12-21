import { KanjiVG } from "kanjivg-js";

const kv = new KanjiVG();

export async function logKanji(kanji:string) {
    // for (const element of "沢山") {console.log(element)}
    let destArray = [];
    for (const element of kanji) {    
        let info = await kv.getKanji(element);
        if (info !== undefined) {
            let kanjiInfo = info.at(0);
            destArray.push(kanjiInfo)
    }}
    console.log(destArray)
    return destArray
};