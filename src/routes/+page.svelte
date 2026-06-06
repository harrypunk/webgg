<script lang="ts">
	import { resolve } from '$app/paths';

	interface Game {
		id: string;
		title: string;
		description: string;
		path: '/hello' | '/spaceshoot1' | '/pingpong';
	}

	const games: Game[] = [
		{
			id: 'hello',
			title: 'Hello Babylon',
			description: 'A simple Babylon.js playground with a sphere and ground.',
			path: '/hello'
		},
		{
			id: 'spaceshoot1',
			title: 'Space Shoot 1',
			description: 'Top-down space shooter. Work in progress.',
			path: '/spaceshoot1'
		},
		{
			id: 'pingpong',
			title: 'Ping Pong',
			description: 'Classic paddle game. Work in progress.',
			path: '/pingpong'
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
		color: #ffff00;
		margin-bottom: 0.5rem;
		text-shadow: 0 0 12px #ffff00;
		letter-spacing: 4px;
	}

	.hero p {
		font-size: 1.125rem;
		color: #00d4ff;
		text-shadow: 0 0 6px #00d4ff;
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
		background: #0a0a0a;
		border: 2px solid #00ff41;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.card:hover {
		border-color: #ffff00;
		box-shadow: 0 0 16px #ffff00;
	}

	.card h2 {
		font-size: 1.25rem;
		color: #00ff41;
		margin-bottom: 0.5rem;
		text-shadow: 0 0 6px #00ff41;
	}

	.card p {
		color: #c0c0c0;
		font-size: 0.95rem;
	}
</style>
