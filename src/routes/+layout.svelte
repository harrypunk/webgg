<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import MeteorSky from '$lib/components/MeteorSky.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import '$lib/styles/app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>WebGG — Babylon.js Games</title>
</svelte:head>

<MeteorSky />

<header>
	<nav>
		<a href={resolve('/')}>WebGG</a>
	</nav>
</header>

<div class="shell">
	<SideNav />
	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: 'Share Tech Mono', 'Courier New', monospace;
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

	.shell {
		flex: 1;
		min-height: 0;
		display: flex;
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
