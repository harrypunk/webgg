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

<!-- Renders inside the shared side panel; buttons pick up the universal
	 `.side-panel button` style from app.css. -->
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

<style>
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

	.readout {
		font-size: 0.85rem;
		text-align: center;
	}
</style>
