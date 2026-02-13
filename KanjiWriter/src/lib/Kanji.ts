// @ts-nocheck
import { KanjiVG, type KanjiData, type StrokeData } from "kanjivg-js";
// import { kuromoji } from "https://code4fukui.github.io/kuromoji-es/kuromoji.js";
import { toHiragana } from "wanakana";
const kv = new KanjiVG();
let characters: string[];
let strokes: StrokeData[][];
let unicodes: string[];

export function getCharacters():string[] { return characters}

export function getStrokeData():StrokeData[][] { return strokes}

export function getUnicode():string[] {return unicodes}

export async function extractKanjiInfo(kanji:string): Promise<[string[], StrokeData[][]]> {
    // for (const element of "沢山") {console.log(element)}
    let destArray = [];
    for (const element of kanji) {    
        let info = await kv.getKanji(element);
        if (info !== undefined) {
            let kanjiInfo = info.at(0);
            destArray.push(kanjiInfo)
    }}
    
    characters = [];
    strokes = [];
    unicodes = [];
    destArray.forEach((element:KanjiData) => {
        characters.push(element.character)
        strokes.push(element.strokes)
        unicodes.push(element.unicode)
    });

    // console.log("characters: ", characters)
    // console.log("strokes: ", strokes)
    return [characters, strokes]
}

let tokenizer = null;
const dictPath = "/dict"

// export async function initTokenizer() {
//     // tokenizer = await kuromoji.createTokenizer();
//     tokenizer = kuromoji.builder({dicPath: dictPath}).build(
//         function (err, tokenizer) {
//             const path = tokenizer.tokenize("すもももももももものうち");
//             console.log(path)
//         })
// }

export function kanjiToKana(text:string) {
    if (!tokenizer) return text;
    const tokens = tokenizer.tokenize(text);
    return tokens.map(token => {
        if (token.reading) {
            return toHiragana(token.reading)
        }
        return token.surface_form;
    }).join("")
}