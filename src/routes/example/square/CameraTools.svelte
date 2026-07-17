<script lang="ts">
	import type { Vector3 } from '@babylonjs/core/Maths/math.vector';

	interface Props {
		/** Current camera position, used only for the readout display. */
		position: Vector3;
		/** Called when a direction button is clicked, with the pan direction. */
		onPan: (dx: number, dy: number) => void;
	}

	let { position, onPan }: Props = $props();
</script>

<aside class="tools">
	<h2>Tools</h2>
	<div class="pad">
		<button onclick={() => onPan(0, 1)}>Up</button>
		<div class="pad-row">
			<button onclick={() => onPan(-1, 0)}>Left</button>
			<button onclick={() => onPan(1, 0)}>Right</button>
		</div>
		<button onclick={() => onPan(0, -1)}>Down</button>
	</div>
	<p class="readout">
		camera: {position.x.toFixed(1)}, {position.y.toFixed(1)}
	</p>
</aside>

<style>
	.tools {
		width: 180px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-bg);
		border: 2px solid var(--color-primary);
		box-shadow: var(--glow-primary-lg);
	}

	.tools h2 {
		font-size: 1rem;
		color: var(--color-primary);
		text-shadow: var(--glow-primary-sm);
		margin: 0;
	}

	.pad {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.pad-row {
		display: flex;
		gap: 0.5rem;
	}

	.pad button {
		padding: 0.4rem 0.8rem;
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		background: var(--color-surface);
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		border-radius: 4px;
	}

	.pad button:hover {
		background: var(--color-primary);
		color: var(--color-bg);
	}

	.readout {
		font-size: 0.85rem;
		color: var(--color-text);
		text-align: center;
	}
</style>
