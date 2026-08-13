<script lang="ts">
	import { createPolled } from '$lib/polled.svelte.js';
	import type { ViewAxis } from './viewAxis';

	interface Props {
		axis: ViewAxis;
	}

	let { axis }: Props = $props();

	// The axis is written every render tick and stays non-reactive on purpose;
	// the readout polls a throttled reactive snapshot instead of tracking it.
	const front = createPolled(() => ({ x: axis.front.x, z: axis.front.z }));
</script>

<p>front axis: ({front.value.x.toFixed(2)}, {front.value.z.toFixed(2)})</p>
