<!-- Base layout (navbar, theme...) -->

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
<a href="/">Home</a>
<a href="/study">Study</a>
<a href="/browse">Browse</a>
<a href="/settings">Settings</a>
</nav>
{@render children?.()}
