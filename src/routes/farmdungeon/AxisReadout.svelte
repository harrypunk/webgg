<script lang="ts">
	import type { ViewAxis } from './viewAxis';

	interface Props {
		axis: ViewAxis;
	}

	let { axis }: Props = $props();

	// Reactive snapshot of the shared axis, refreshed on a slow interval. The
	// axis itself is written every render tick and must stay non-reactive, so
	// the template reads this throttled copy instead.
	let front = $state({ x: 0, z: 0 });

	$effect(() => {
		const id = setInterval(() => {
			front = { x: axis.front.x, z: axis.front.z };
		}, 100);
		return () => clearInterval(id);
	});
</script>

<p>front axis: ({front.x.toFixed(2)}, {front.z.toFixed(2)})</p>
