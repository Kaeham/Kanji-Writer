<script lang="ts">
    import { onMount } from 'svelte';

    let canvas:HTMLCanvasElement;
    let ctx:CanvasRenderingContext2D;
    let flag = false;
    let dot_flag = false

    onMount(() => {
        ctx = canvas.getContext("2d")!;
    })


    // curr and prev is for drawing the stroke
    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;
    
    // Final is for calculations for a single stroke
    let startX = 0, startY = 0;
    let finalX = 0, finalY = 0;
    // let dx = $derived(finalX - startX);
    // let dy = $derived(finalY - startY);
    let stroke;

    let strokeColor = "black";
    let strokeWidth = 2;

    function draw() {
        // console.log("drawing")
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
        ctx.closePath();
    }
    
    function HandleDown(e:MouseEvent) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        startX = currX;
        startY = currY;
        // console.log("Down, prev:", prevX, "cur", currX)
        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = strokeColor;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
            }
        }
    function HandleUp(e: MouseEvent) {
        finalX = currX;
        finalY = currY;
        flag = false;
        stroke = check_stroke_direction();
        console.log("stroke dir: ", stroke);
        }

    function HandleMove(e: MouseEvent) {
        if (flag) {
            // console.log("Move, prev:", prevX, "cur", currX)
            // console.log("Move, prev Y:", prevY, "cur Y", currY)
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
            }
        }
    
    function check_stroke_direction() {
        let tolerance = 5; // tolerance in degress
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

<canvas bind:this={canvas}
    onmousedown={HandleDown}
    onpointerup={HandleUp}
    onmouseout={null}
    onblur={null} 
    onmousemove={HandleMove}
    width=500
    height=300
    id="kanjiCanvas"
></canvas>

<style>
    #kanjiCanvas {
		border-color: black;
        border-style: solid;
	}
</style>