<script lang="ts">
  	import { onMount } from 'svelte';
  	let canvas: HTMLCanvasElement;
  	let ctx: CanvasRenderingContext2D;
	let drawing = false;

  	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		canvas.addEventListener('mousedown', () => drawing = true);
		canvas.addEventListener('mouseup', () => drawing = false);
		canvas.addEventListener('mousemove', (e) => {
			if (!drawing) return;
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(e.offsetX, e.offsetY);
		});
	});
  	export function clearPad() {
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
  	}	
</script>

<canvas bind:this={canvas} width="300" height="300" class="border"></canvas>

<div class="mt-2">
	<button class="bg-gray-200 px-3 py-1 rounded" on:click={clearPad}>Clear</button>
</div>
