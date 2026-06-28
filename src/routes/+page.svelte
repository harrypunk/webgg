<script lang="ts">
	import { resolve } from '$app/paths';

	interface Game {
		id: string;
		title: string;
		description: string;
		path: '/hello' | '/pingpong' | '/example/switch1';
	}

	const games: Game[] = [
		{
			id: 'hello',
			title: 'Hello Babylon',
			description: 'A simple Babylon.js playground with a sphere and ground.',
			path: '/hello'
		},
		{
			id: 'pingpong',
			title: 'Ping Pong',
			description: 'Classic paddle game. Work in progress.',
			path: '/pingpong'
		},
		{
			id: 'switch1',
			title: 'Scene Switcher',
			description: 'Cycle through cube, sphere, and cone scenes.',
			path: '/example/switch1'
		}
	];
</script>

<section class="hero">
	<h1>WebGG</h1>
	<p>A collection of Babylon.js games and experiments.</p>
</section>

<section class="games">
	{#each games as game (game.id)}
		<a href={resolve(game.path)} class="card">
			<h2>{game.title}</h2>
			<p>{game.description}</p>
		</a>
	{/each}
</section>

<style>
	.hero {
		text-align: center;
		padding: 3rem 1rem;
	}

	.hero h1 {
		font-size: 3.5rem;
		color: var(--color-secondary);
		margin-bottom: 0.5rem;
		text-shadow: var(--glow-secondary-lg);
		letter-spacing: 4px;
	}

	.hero p {
		font-size: 1.125rem;
		color: var(--color-accent);
		text-shadow: var(--glow-accent);
	}

	.games {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.card {
		display: block;
		padding: 1.5rem;
		background: var(--color-surface);
		border: 2px solid var(--color-primary);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.card:hover {
		border-color: var(--color-secondary);
		box-shadow: var(--glow-secondary-lg);
	}

	.card h2 {
		font-size: 1.25rem;
		color: var(--color-primary);
		margin-bottom: 0.5rem;
		text-shadow: var(--glow-primary-md);
	}

	.card p {
		color: var(--color-text);
		font-size: 0.95rem;
	}
</style>
