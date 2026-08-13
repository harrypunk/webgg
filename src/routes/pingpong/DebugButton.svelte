<script lang="ts">
	interface Props {
		debug?: boolean;
	}

	let { debug = $bindable(false) }: Props = $props();
</script>

<!-- Styled by the universal `.side-panel button` rules in app.css. -->
<button type="button" onclick={() => (debug = !debug)}>
	Debug: {debug ? 'ON' : 'OFF'}
</button>
