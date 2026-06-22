<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>WebGG — Babylon.js Games</title>
</svelte:head>

<header>
	<nav>
		<a href={resolve('/')}>WebGG</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: 'Courier New', Courier, monospace;
		background: #000;
		color: #c0c0c0;
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	header {
		padding: 1rem 2rem;
		border-bottom: 2px solid #00ff41;
		background: #0a0a0a;
	}

	nav a {
		color: #ffff00;
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 700;
		text-shadow: 0 0 8px #ffff00;
	}

	nav a:hover {
		color: #00ff41;
		text-shadow: 0 0 8px #00ff41;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem;
		min-height: 0;
	}
</style>
