<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { games } from '$lib/games';
</script>

<!-- Global game switcher. Large desktop screens only — hidden entirely below
	 the breakpoint so smaller layouts stay untouched. -->
<nav class="side-nav" aria-label="Games">
	<ul>
		{#each games as game (game.id)}
			{@const href = resolve(game.path)}
			<li>
				<a
					{href}
					class:active={page.url.pathname === href}
					aria-current={page.url.pathname === href ? 'page' : undefined}
				>
					{game.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.side-nav {
		display: none;
	}

	@media (min-width: 1200px) {
		.side-nav {
			display: block;
			flex-shrink: 0;
			width: 200px;
			padding: 2rem 0;
			border-right: 2px solid var(--color-primary);
		}

		ul {
			list-style: none;
		}

		a {
			display: block;
			padding: 0.5rem 1.5rem;
			color: var(--color-text);
			text-decoration: none;
			border-left: 3px solid transparent;
		}

		a:hover {
			color: var(--color-primary);
			text-shadow: var(--glow-primary-sm);
		}

		a.active {
			color: var(--color-primary);
			background: var(--color-surface);
			border-left-color: var(--color-primary);
			text-shadow: var(--glow-primary-sm);
		}
	}
</style>
