// @ts-nocheck
import { KanjiVG, type KanjiData, type StrokeData } from "kanjivg-js";
import { preprocess_kanji } from "./db";
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

async function kanji_call(input_kanji:string) {
    const APICall = '/api/jisho?kanji=' + input_kanji;
    try {
        const res = await fetch(APICall)
        const fin = await res.json()
        return fin
    } catch (err) {
        return {error: "kanji lookup failed" + err}
    }
}

export function kanji_to_kana(text:string) {
    if (!tokenizer) return text;
    const tokens = tokenizer.tokenize(text);
    return tokens.map(token => {
        if (token.reading) {
            return toHiragana(token.reading)
        }
        return token.surface_form;
    }).join("")
}

export async function get_kanji_meaning(input_kanji:string) {
    const preprocess = preprocess_kanji(input_kanji)
    if (!preprocess.ok) {console.log(preprocess); return preprocess}
    const jishoReturn = await kanji_call(input_kanji)
    if (jishoReturn.error) {return jishoReturn}
    
    const firstKanji = 0;
    const senses = jishoReturn.data[firstKanji].senses
    let meanings = [];
    for (const idx in senses) {
        const meaning = senses[idx].english_definitions
        console.log(meaning)
        meanings.push(meaning)
    }
    return meanings;
}