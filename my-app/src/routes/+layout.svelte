<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		let canvas = document.getElementById("kanjiCanvas");
		let flag = false;
		let dot_flag = false
		// console.log(canvas)
		let ctx = canvas.getContext("2d");
		let w = canvas?.clientWidth;
		let h = canvas?.clientHeight;
		let prevX = 0;
		let prevY = 0;
		let currX = 0;
		let currY = 0;
		let strokeColor = "black";
		let strokeWidth = 2;

		canvas?.addEventListener("mousemove", function (e) {
			findxy('move', e)
		}, false)
		canvas?.addEventListener("mousedown", function (e) {
			findxy('down', e)
		}, false)
		canvas?.addEventListener("mouseup", function (e) {
			findxy('up', e)
		}, false)
		canvas?.addEventListener("mouseout", function (e) {
			findxy('out', e)
		}, false)

		function draw() {
			ctx?.beginPath();
			ctx?.moveTo(prevX, prevY);
			ctx?.lineTo(currX, currY);
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = strokeWidth;
			ctx.stroke();
			ctx.closePath();
		}

		function findxy(res: string, e:MouseEvent) {
			if (res == "down") {
				prevX = currX;
				prevY = currY;
				currX = e.clientX - canvas.offsetLeft;
				currY = e.clientY - canvas.offsetTop;

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
			if (res == 'up' || res == 'out') {
				flag = false;
			}
			if (res == 'move') {
				if (flag) {
					prevX = currX;
					prevY = currY;
					currX = e.clientX - canvas.offsetLeft;
					currY = e.clientY - canvas.offsetTop;
					draw();
				}
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>



{@render children()}
