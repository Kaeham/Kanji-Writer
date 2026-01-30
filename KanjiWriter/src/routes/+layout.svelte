<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import { onMount } from 'svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<!-- <ul class="navbar"></ul>
		<li class="navItem"> <a href="/"> Home</a></li>
		<li class="navItem"> <a href="/deck"> Deck</a></li>
		<li class="navItem"> <a href="/review"> Review</a></li>
		<li class="navItem"> <a href="/test"> Test</a></li>
	</ul> -->
	<a href="/"> Home</a>
	<a href="/deck"> Deck</a>
	<a href="/review"> review</a>
	<a href="/test"> test</a>
</nav>

<style>
	.navbar {
		display: flex;
		flex-direction: row;
	}
	.navItem {
		padding-right: 20px;
		
	}
</style>

{@render children()}
