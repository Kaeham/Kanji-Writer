<script lang="ts">
    import { onMount } from 'svelte';
    let { kanji = "高" } = $props();

    let drawingCanvas:HTMLCanvasElement;
    let displayCanvas:HTMLCanvasElement;
    let drawingCtx:CanvasRenderingContext2D;
    let displayCtx:CanvasRenderingContext2D;
    let flag = false;
    let dot_flag = false
    const stroke_direction: number = 0;
    const stroke_coords: [[number, number], [number, number]] = [[100, 100], [200, 100]];

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
        stroke = check_stroke_direction();
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
    function check_stroke_direction() {
        let tolerance = 10; // tolerance in degress
        let dx = finalX - startX;
        let dy = startY - finalY; // Y is 0 at the top for some reason?
        console.log("X:", startX, finalX, "Y: ", startY, finalY)
        console.log("dx: ", dx, "dy: ", dy)
        
        let yFlat = Math.atan(dx/dy) * (180 / Math.PI);
        let xFlat = Math.atan(dy/dx) * (180 / Math.PI);
        console.log(xFlat, yFlat)
        
        if (-1*tolerance <= yFlat && yFlat <= tolerance) { 
            if (dy > 0) {return 90} // up
            else {return 270} // down
        }
        if (-1*tolerance <= xFlat && xFlat <= tolerance) {
            if (dx > 0) {return 0} // up
            else {return 180} // down
        }
        if (dy > 0) {
            if (dx > 0) { return 45} // diagonal up-right
            else { return 135} // diagonal up-left
        }
        else {
            if (dx > 0) { return 315} // diagonal down-right
            else { return 225} // diagonal down-left
        }
        
    }
</script>

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