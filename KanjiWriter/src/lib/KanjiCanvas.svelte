<script lang="ts">
    import { onMount } from 'svelte';
    import * as kanji from './Kanji.ts';
    import type { StrokeData } from 'kanjivg-js';
    import DynamicTimeWarping from 'dynamic-time-warping-ts';

    let contentDiv:HTMLDivElement;
    
    // drawing
    import { check_stroke_direction, parse_svg_line, render_svg_line, draw, render_sampled_points, get_start_point } from './CanvasMethods';
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
    let drawnX:number[] = [];
    let drawnY:number[] = [];
    const distFunc = (a:[number, number], b:[number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1])
    const distFuncXY = (a:number, b:number) => Math.abs(a-b);
    const DIST_THRESHOLD:number = 100;
    // curr and prev is for drawing the stroke
    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;
    // Start & Final is for calculations for a single stroke
    let startX = 0, startY = 0;
    let finalX = 0, finalY = 0;
    //
    let xOffset:number;
    let yOffset:number;

    const strokeColor = "black", strokeWidth = 5;

    
    function HandleDown(e:MouseEvent) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - drawingCanvas.offsetLeft;
        currY = e.clientY - drawingCanvas.offsetTop;
        startX = currX;
        startY = currY;
        const strokeStart = get_start_point(strokeData[currentCharacter][currentStroke].path)
        // console.log("start", strokeStart)
        xOffset = strokeStart[X_INDEX] - currX
        yOffset = strokeStart[Y_INDEX] - currY

        // initial coords
        strokeCoords.push([startX+xOffset, startY+yOffset])
        // drawnX.push(startX)
        drawnX.push(startX + xOffset)
        // drawnY.push(startY)
        drawnY.push(startY + yOffset)


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
            currX = e.clientX - drawingCanvas.offsetLeft;
            currY = e.clientY - drawingCanvas.offsetTop;
            
            strokeCoords!.push([currX+xOffset, currY+yOffset])
            // drawnX.push(currX)
            drawnX.push(currX + xOffset)
            // drawnY.push(currY)
            drawnY.push(currY + yOffset)

            draw(drawingCtx, prevX, currX, prevY, currY);
            }
    }
    function HandleUp(e: MouseEvent) {
        flag = false;
        finalX = currX;
        finalY = currY;
        strokeCoords.push([finalX+xOffset, finalY+yOffset])
        drawnX.push(finalX+xOffset)
        drawnY.push(finalY+yOffset)

        const drawnPoints:number = drawnX.length
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        
        const dx = finalX - startX;
        const dy = startY - finalY; // Y is 0 at the top for some reason?
        // stroke = check_stroke_direction(dx, dy);
        // console.log("stroke dir: ", stroke);
        // console.log(strokeCoords)

        const sampledPoints = parse_svg_line(strokeData[currentCharacter][currentStroke].path, drawnPoints)
        // console.log(xOffset, yOffset)
        // console.log("Sample", sampledPoints)
        // console.log("X: ", drawnX)
        // console.log("Y: ", drawnY)
        const dtw = new DynamicTimeWarping(strokeCoords, sampledPoints, distFunc)
        const sampleX:number[] = []
        const sampleY:number[] = []
        sampledPoints.forEach(point => {
            sampleX.push(point.at(X_INDEX))
            sampleY.push(point.at(Y_INDEX))
        })

        const dtwX = new DynamicTimeWarping(drawnX, sampleX, distFuncXY)
        const dtwY = new DynamicTimeWarping(drawnY, sampleY, distFuncXY)
        const distance = dtw.getDistance()
        const Xdistance = dtwX.getDistance()
        const Ydistance = dtwY.getDistance()
        console.log("distance", distance)
        console.log("X distance", Xdistance)
        console.log("Y distance", Ydistance)

        // if (Xdistance <= DIST_THRESHOLD && Ydistance <= DIST_THRESHOLD) 
        if (distance/3 < DIST_THRESHOLD)
        {
            // add a length/width checker for the stroke
            render_svg_line(displayCtx, strokeData[currentCharacter][currentStroke].path)
            // iterate to next stroke and stroke coordinates
            if (currentStroke < strokeData[currentCharacter].length) {currentStroke++}
            // if final stroke move on to next character in kanji
            else if (currentCharacter < strokeData.length) {currentCharacter++; currentStroke = 0}
            // if final kanji, rate completion and move on to next kanji
        }
        strokeCoords = []; // clear coordinates
        drawnX = [];
        drawnY = [];

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
            // let points = parse_svg_line(strokeData[currentCharacter][currentStroke+i].path, 25);
            // render_sampled_points(displayCtx, points)
        }
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

    #kanjiDisplayCanvas {
        border-color: red;
        border-style: solid;
    }

    .KanjiCanvas {
        border-color: red;
        border-style: solid;
    }
</style>