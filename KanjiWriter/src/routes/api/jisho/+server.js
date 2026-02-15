import { json } from "@sveltejs/kit";

export async function GET({url}) {
    const kanji = url.searchParams.get("kanji")
    if (!kanji) {
        return json({error: "missing kanji param"}, { status: 400});
    }

    const jishoAPICall = "https://jisho.org/api/v1/search/words?keyword=" +
         encodeURIComponent(kanji);
        
    const res = await fetch(jishoAPICall);
    const data = await res.json();

    return json(data)
}