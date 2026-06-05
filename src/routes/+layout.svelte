<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';

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
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		background: #0f0f1a;
		color: #e0e0e0;
		line-height: 1.6;
	}

	header {
		padding: 1rem 2rem;
		border-bottom: 1px solid #2a2a3a;
		background: #16162a;
	}

	nav a {
		color: #00d4ff;
		text-decoration: none;
		font-size: 1.25rem;
		font-weight: 700;
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
