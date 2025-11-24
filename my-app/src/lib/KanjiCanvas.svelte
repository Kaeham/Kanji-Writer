<script lang="ts">
    import { onMount } from 'svelte';

    let canvas:HTMLCanvasElement;
    let ctx:CanvasRenderingContext2D;

    // let w = canvas.clientWidth;
    // let h = canvas.clientHeight;

    let flag = false;
    let dot_flag = false
    // console.log(canvas)
    onMount(() => {
        ctx = canvas.getContext("2d")!;
    })


    let prevX = 0, prevY = 0;
    let currX = 0, currY = 0;

    let strokeColor = "black";
    let strokeWidth = 2;

    function draw() {
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
        console.log("prev:", prevX, "cur", currX)
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
        flag = false;
        }
    function HandleMove(e: MouseEvent) {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
            }
        }
</script>

<canvas bind:this={canvas}
onmousedown={HandleDown}
onmouseup={HandleUp}
onmouseout={HandleUp}
onblur={null} 
onmousemove={HandleMove}
width=500
height=300 
></canvas>