<script lang="ts">
    import { onMount } from 'svelte';
    import * as kanji from '$lib/kanji/Kanji';
    import type { StrokeData } from 'kanjivg-js';
    import DynamicTimeWarping from 'dynamic-time-warping-ts';

    let contentDiv:HTMLDivElement;
    let showButton:HTMLButtonElement;
    let canvasVisibility:boolean = true;
    let svgDisplay:SVGElement;
    
    // drawing
    import * as drawing from './CanvasMethods';
    import { Tween } from 'svelte/motion';
    let drawingCanvas:HTMLCanvasElement;
    let displayCanvas:HTMLCanvasElement;
    let drawingCtx:CanvasRenderingContext2D;
    let displayCtx:CanvasRenderingContext2D;
    let flag = false;
    let dot_flag = false;
    const X_INDEX = 0;
    const Y_INDEX = 1;
    let errors:number = $state(0);
    let totalErrors:number = 0;
    let fadeout = new Tween(0);
    let { firsttime, word, ...others } = $props();

    // stroke information
    let currentStroke:number = $state(0);
    let currentCharacter:number = $state(0);
    let strokeCoords:[number, number][] = [];
    const distFunc = (a:[number, number], b:[number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1])
    const DIST_THRESHOLD:number = 10;
    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;
    // offsets to ensure drawn stroke starts at the right pos
    let xOffset:number;
    let yOffset:number;
    const strokeColor = "black", strokeWidth = 5;

    // kanji info
    let characters: string[];
    let strokeData: StrokeData[][] = $state([[]]);
    let currentSVG = $derived(strokeData?.[currentCharacter]?.[currentStroke]?.path ?? "")
    // let unicodes;

    
    function HandleDown(e:MouseEvent) {
        prevX = currX;
        prevY = currY;
        const mouseCoords = drawing.get_mouse_pos(drawingCanvas, e)
        currX = mouseCoords.x;
        currY = mouseCoords.y;
        const strokeStart = drawing.get_start_point(currentSVG)
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
            dot_flag = false;}
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
        drawing.clearCanvas(drawingCanvas, drawingCtx)

        stroke_checking();
    }

    function stroke_checking() {
        const drawnPoints:number = strokeCoords.length
        const sampledPoints = drawing.sample_svg_line(currentSVG, drawnPoints)
        const dtw = new DynamicTimeWarping(strokeCoords, sampledPoints, distFunc)
        const distance = dtw.getDistance()
        const normDis = distance/dtw.getPath().length

        // console.log("normalized distance", normDis)
        // console.log("distance", distance)
        // console.log("current: ", currentCharacter, currentStroke)
        // console.log("lenghts:", strokeData[currentCharacter].length, strokeData.length)
        if (normDis < DIST_THRESHOLD) {
            first_practice(firsttime)
            console.log("Drawin")
            totalErrors += errors
            errors = 0
            drawing.render_svg_line(displayCtx, currentSVG)
            if (currentStroke < strokeData[currentCharacter].length - 1) {currentStroke++}
            else if (currentCharacter < strokeData.length - 1) {
                currentCharacter++; currentStroke = 0
                drawing.clearCanvas(displayCanvas, displayCtx)                
            }
            else { 
                const time_delta = drawing.rate_completion(totalErrors)
                others.completion(time_delta);
             }} 
        else { 
            errors += 1;
            if (errors >= 3) {
                drawing.preview_stroke(fadeout)
            }
        }
        strokeCoords = []; // clear coordinates
    }

    function first_practice(first_time) {
        if (first_time) {
            strokeData[currentCharacter].forEach(stroke => {
                drawing.render_svg_line(displayCtx, stroke.path, "rgba(0, 0, 0, 0.3")
            });
        }
    }
    

    onMount( async () => { 
        drawingCtx = drawingCanvas.getContext("2d")!;
        displayCtx = displayCanvas.getContext("2d")!;
    })

    // complete stroke -> update current stroke
    $effect( () => {
        kanji.extractKanjiInfo(word).then(result => {
            characters = result.at(0);
            strokeData = result.at(1);
        })}
        // first_practice(firsttime);
        )

</script>


<div class="KanjiCanvas" bind:this={contentDiv}>
    <svg width="300" height="300" bind:this={svgDisplay} id="kanjiDisplay">
        <path d={drawing.preprocess_svg(currentSVG).encode()} fill="none" stroke="black" 
        stroke-width=3 stroke-opacity={fadeout.current}/>
    </svg>
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
<!-- <div id="answerButton">
    <button 
    class="answerButton"
    id="showKanjiButton" 
    bind:this={showButton}
    onclick={() => {canvasVisibility = !canvasVisibility; console.log(canvasVisibility)}}
    >
    Show Kanji</button>
</div> -->

<style>
    .KanjiCanvas {
        position:relative;
        /* width: 100%; */
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