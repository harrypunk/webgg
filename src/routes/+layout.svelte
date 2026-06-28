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
		background: var(--color-bg);
		color: var(--color-text);
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	header {
		padding: 1rem 2rem;
		border-bottom: 2px solid var(--color-primary);
		background: var(--color-surface);
	}

	nav a {
		color: var(--color-secondary);
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 700;
		text-shadow: var(--glow-secondary);
	}

	nav a:hover {
		color: var(--color-primary);
		text-shadow: var(--glow-primary);
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
