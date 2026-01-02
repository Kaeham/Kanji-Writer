<script lang="ts">
    import { onMount } from 'svelte';
    import * as kanji from './Kanji.ts';
    import type { StrokeData } from 'kanjivg-js';
    import DynamicTimeWarping from 'dynamic-time-warping-ts';

    let contentDiv:HTMLDivElement;
    let showButton:HTMLButtonElement;
    let canvasVisibility:boolean = true;
    
    // drawing
    import * as drawing from './CanvasMethods';
    let drawingCanvas:HTMLCanvasElement;
    let displayCanvas:HTMLCanvasElement;
    let drawingCtx:CanvasRenderingContext2D;
    let displayCtx:CanvasRenderingContext2D;
    let flag = false;
    let dot_flag = false;
    const X_INDEX = 0;
    const Y_INDEX = 1;

    // stroke information
    let currentStroke:number = 0;
    let currentCharacter:number = 0;
    let strokeCoords:[number, number][] = []; // delete if X and Y distance separation works
    const distFunc = (a:[number, number], b:[number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1])
    const DIST_THRESHOLD:number = 10;
    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;
    // offsets to ensure drawn stroke starts at the right pos
    let xOffset:number;
    let yOffset:number;

    const strokeColor = "black", strokeWidth = 5;

    
    function HandleDown(e:MouseEvent) {
        prevX = currX;
        prevY = currY;
        const mouseCoords = drawing.get_mouse_pos(drawingCanvas, e)
        currX = mouseCoords.x;
        currY = mouseCoords.y;
        const strokeStart = drawing.get_start_point(strokeData[currentCharacter][currentStroke].path)
        // console.log("start", strokeStart)
        xOffset = strokeStart[X_INDEX] - currX
        yOffset = strokeStart[Y_INDEX] - currY

        // initial coords
        strokeCoords.push([currX+xOffset, currY+yOffset])

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            drawingCtx.beginPath();
            drawingCtx.fillStyle = strokeColor;
            drawingCtx.fillRect(currX, currY, 2, 2);
            drawingCtx.closePath();
            dot_flag = false;
        }}

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
            const mouseCoords = drawing.get_mouse_pos(drawingCanvas, e)
            currX = mouseCoords.x;
            currY = mouseCoords.y;
            
            strokeCoords!.push([currX+xOffset, currY+yOffset])

            drawing.draw(drawingCtx, prevX, currX, prevY, currY, strokeWidth, strokeColor);
            }
    }
    function HandleUp(e: MouseEvent) {
        flag = false;
        const mouseCoords = drawing.get_mouse_pos(drawingCanvas, e)
        currX = mouseCoords.x;
        currY = mouseCoords.y;
        strokeCoords.push([currX+xOffset, currY+yOffset])

        const drawnPoints:number = strokeCoords.length
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)

        const sampledPoints = drawing.parse_svg_line(strokeData[currentCharacter][currentStroke].path, drawnPoints)
        console.log("stroke", strokeCoords)
        console.log("sample", sampledPoints)
        const dtw = new DynamicTimeWarping(strokeCoords, sampledPoints, distFunc)
        const distance = dtw.getDistance()
        const normDis = distance/dtw.getPath().length
        console.log("normalized distance", normDis)
        console.log("distance", distance)
        if (normDis < DIST_THRESHOLD)
        {
            console.log("Drawin")
            // add a length/width checker for the stroke
            drawing.render_svg_line(displayCtx, strokeData[currentCharacter][currentStroke].path)
            // iterate to next stroke and stroke coordinates
            if (currentStroke < strokeData[currentCharacter].length) {currentStroke++}
            // if final stroke move on to next character in kanji
            else if (currentCharacter < strokeData.length) {currentCharacter++; currentStroke = 0}
            // if final kanji, rate completion and move on to next kanji
        }
        strokeCoords = []; // clear coordinates

    }

    function rate_completion() {}

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
        // unicodes = kanji.getUnicode();
        for (let i=0; i<strokeData[currentCharacter].length; i++) {
            let points = drawing.parse_svg_line(strokeData[currentCharacter][currentStroke+i].path, 25);
            drawing.render_sampled_points(displayCtx, points)
        }
    })
</script>


<div class="KanjiCanvas" bind:this={contentDiv}>
    <canvas 
        bind:this={displayCanvas}
        width=300
        height=300
        id="kanjiDisplayCanvas">
    </canvas>
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
    
</div>
<div id="answerButton">
    <button 
    class="answerButton"
    id="showKanjiButton" 
    bind:this={showButton}
    onclick={() => {canvasVisibility = !canvasVisibility; console.log(canvasVisibility)}}
    >
    Show Kanji</button>
</div>



<style>
    .KanjiCanvas {
        position:relative;
        width: 100%;
        height: 300px;
        border-color: violet;
        border-style: solid;
        display: flex;
        flex-direction: row;
        /* flex-wrap: ; */
        justify-content: center;
    }
    #kanjiDrawingCanvas {
        z-index: 1;
        border-color: black;
        border-style: solid;
        position: absolute;
        top: 0%;
        bottom: 0%;
	}
    
    #kanjiDisplayCanvas {
        z-index: 0;
        border-color: red;
        border-style: solid;
        position: absolute;
        top: 0%;
        bottom: 0%;
    }
    #answerButton {
        display: block;
        border-color: green;
        border-style: solid;          
    }
</style>