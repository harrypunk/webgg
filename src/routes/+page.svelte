<script lang="ts">
	import { resolve } from '$app/paths';

	interface Game {
		id: string;
		title: string;
		description: string;
		path: '/hello';
	}

	const games: Game[] = [
		{
			id: 'hello',
			title: 'Hello Babylon',
			description: 'A simple Babylon.js playground with a sphere and ground.',
			path: '/hello'
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
		font-size: 3rem;
		color: #00d4ff;
		margin-bottom: 0.5rem;
	}

	.hero p {
		font-size: 1.125rem;
		color: #a0a0b0;
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
		background: #1a1a2e;
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		border-color: #00d4ff;
	}

	.card h2 {
		font-size: 1.25rem;
		color: #00d4ff;
		margin-bottom: 0.5rem;
	}

	.card p {
		color: #a0a0b0;
		font-size: 0.95rem;
	}
</style>
