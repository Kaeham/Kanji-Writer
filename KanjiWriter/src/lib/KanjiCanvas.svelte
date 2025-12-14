<script lang="ts">
    import { onMount } from 'svelte';
    import Kanji from './Kanji.svelte';
    import { check_stroke_direction } from './CanvasMethods';

    let drawingCanvas:HTMLCanvasElement;
    let displayCanvas:HTMLCanvasElement;
    let drawingCtx:CanvasRenderingContext2D;
    let displayCtx:CanvasRenderingContext2D;
    let flag = false;
    let dot_flag = false
    const stroke_direction: number = 0;
    const stroke_coords: [[number, number], [number, number]] = [[100, 100], [200, 100]];
    let chars:string[];
    let meaning:string; 
    let kana:string[];

    onMount(() => { 
        drawingCtx = drawingCanvas.getContext("2d")!;
        displayCtx = displayCanvas.getContext("2d")!;        
    })


    // curr and prev is for drawing the stroke
    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;
    
    // Start & Final is for calculations for a single stroke
    let startX = 0, startY = 0;
    let finalX = 0, finalY = 0;
    let stroke;

    const strokeColor = "black", strokeWidth = 5;

    function draw(ctx:CanvasRenderingContext2D, x1:number, x2:number, y1:number, y2:number) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
        ctx.closePath();
    }
    function HandleDown(e:MouseEvent) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - drawingCanvas.offsetLeft;
        currY = e.clientY - drawingCanvas.offsetTop;
        startX = currX;
        startY = currY;
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
        flag = false;
    }
    function HandleMove(e: MouseEvent) {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - drawingCanvas.offsetLeft;
            currY = e.clientY - drawingCanvas.offsetTop;
            draw(drawingCtx,prevX, currX, prevY, currY);
            }
    }
    function HandleUp(e: MouseEvent) {
        finalX = currX;
        finalY = currY;
        flag = false;
        let dx = finalX - startX;
        let dy = startY - finalY; // Y is 0 at the top for some reason?
        stroke = check_stroke_direction(dx, dy);
        console.log("stroke dir: ", stroke);
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        if (stroke === stroke_direction) {
            // add a length/width checker for the stroke
            let [[x1, y1], [x2, y2]] = stroke_coords;
            draw(displayCtx, x1, x2, y1, y2) // draw the kanji at the correct coordinates
            // iterate to next stroke and stroke coordinates
            // if final stroke move on to next character in kanji
            // if final kanji, rate completion and move on to next kanji
        }
    }



</script>

<Kanji kanji="高"/>

<canvas bind:this={drawingCanvas}
    onmousedown={HandleDown}
    onpointerup={HandleUp}
    onmouseout={HandleOff}
    onblur={null}
    onmousemove={HandleMove}
    width=500
    height=300
    id="kanjiDrawingCanvas"
></canvas>

<button onclick={() => drawingCtx.clearRect(0, 0, drawingCanvas
    .width, drawingCanvas.height)}>
    Clear
</button>

<canvas 
    bind:this={displayCanvas}
    width=500
    height=300
    id="kanjiDisplayCanvas">

</canvas>


<style>
    #kanjiDrawingCanvas {
		border-color: black;
        border-style: solid;
	}
</style>