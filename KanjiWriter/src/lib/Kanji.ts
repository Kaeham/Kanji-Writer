import { KanjiVG, type KanjiData, type StrokeData } from "kanjivg-js";

const kv = new KanjiVG();
let characters: string[];
let strokes: StrokeData[][];
let unicodes: string[];

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

export function getCharacters():string[] { return characters}

export function getStrokeData():StrokeData[][] { return strokes}

export function getUnicode():string[] {return unicodes}