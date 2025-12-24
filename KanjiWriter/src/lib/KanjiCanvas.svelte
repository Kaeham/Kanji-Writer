<script lang="ts">
    import { onMount } from 'svelte';
    import * as kanji from './Kanji.ts';
    import type { StrokeData } from 'kanjivg-js';

    let contentDiv:HTMLDivElement;
    
    // drawing
    import { check_stroke_direction, parse_svg_line, render_svg_line, draw, render_sampled_points } from './CanvasMethods';
    let drawingCanvas:HTMLCanvasElement;
    let displayCanvas:HTMLCanvasElement;
    let drawingCtx:CanvasRenderingContext2D;
    let displayCtx:CanvasRenderingContext2D;
    let flag = false;
    let dot_flag = false

    let currentStroke:number = 0;
    let currentCharacter:number = 0;
    let stroke_direction:number;
    let stroke_coords:[number, number][] = [];
    // curr and prev is for drawing the stroke
    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;
    // Start & Final is for calculations for a single stroke
    let startX = 0, startY = 0;
    let finalX = 0, finalY = 0;
    let stroke;

    const strokeColor = "black", strokeWidth = 5;

    
    function HandleDown(e:MouseEvent) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - drawingCanvas.offsetLeft;
        currY = e.clientY - drawingCanvas.offsetTop;
        startX = currX;
        startY = currY;
        let stroke_coords = [];
        stroke_coords.push([[startX, startY]])
        // console.log("Down, prev:", prevX, "cur", currX)
        flag = true;
        dot_flag = true;
        if (dot_flag) {
            drawingCtx.beginPath();
            drawingCtx.fillStyle = strokeColor;
            drawingCtx.fillRect(currX, currY, 2, 2);
            drawingCtx.closePath();
            dot_flag = false;
            }
    }
    function HandleOff(e:MouseEvent) {
        if (flag === true) {    
            flag = false;
            HandleUp(e)
        }
    }
    function HandleMove(e: MouseEvent) {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - drawingCanvas.offsetLeft;
            currY = e.clientY - drawingCanvas.offsetTop;
            stroke_coords!.push([currX, currY])
            draw(drawingCtx, prevX, currX, prevY, currY);
            }
    }
    function HandleUp(e: MouseEvent) {
        flag = false;
        finalX = currX;
        finalY = currY;
        stroke_coords!.push([finalX, finalY])
        
        let dx = finalX - startX;
        let dy = startY - finalY; // Y is 0 at the top for some reason?
        let count:number = 0;
        stroke = check_stroke_direction(dx, dy);
        console.log("stroke dir: ", stroke);
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        console.log(stroke_coords)
        stroke_coords!.forEach((element:number[]) => {
            let x, y = element;

        });
        stroke_coords = []; // clear coordinates
        if (stroke === stroke_direction) {
            // add a length/width checker for the stroke
            let [[x1, y1], [x2, y2]] = stroke_coords;
            draw(displayCtx, x1, x2, y1, y2) // draw the kanji at the correct coordinates
            // iterate to next stroke and stroke coordinates
            // if final stroke move on to next character in kanji
            // if final kanji, rate completion and move on to next kanji
        }
    }

    // kanji info
    let characters: string[];
    let strokeData: StrokeData[][];
    let unicodes;

    onMount( async () => { 
        drawingCtx = drawingCanvas.getContext("2d")!;
        displayCtx = displayCanvas.getContext("2d")!;
        let word:string = "高校";
        await kanji.extractKanjiInfo(word);
        characters = kanji.getCharacters();
        strokeData = kanji.getStrokeData();
        unicodes = kanji.getUnicode();
        // console.log(characters)
        // console.log(strokeData[currentCharacter][currentStroke])
        let points = parse_svg_line(unicodes[currentCharacter], strokeData[currentCharacter][currentStroke].path);
        render_sampled_points(drawingCtx, points)
        render_svg_line(displayCtx, strokeData[currentCharacter][currentStroke].path, drawingCtx)
    })
</script>

<div class="KanjiCanvas" bind:this={contentDiv}>

    <canvas bind:this={drawingCanvas}
    onmousedown={HandleDown}
    onpointerup={HandleUp}
    onmouseout={HandleOff}
    onblur={null}
    onmousemove={HandleMove}
    width=300
    height=300
    id="kanjiDrawingCanvas"
    ></canvas>

    <canvas 
    bind:this={displayCanvas}
    width=300
    height=300
    id="kanjiDisplayCanvas">
    </canvas>
</div>


<style>
    #kanjiDrawingCanvas {
        border-color: black;
        border-style: solid;
	}

    .KanjiCanvas {
        border-color: red;
        border-style: solid;
    }
</style>