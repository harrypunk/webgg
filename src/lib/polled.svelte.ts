/**
 * Bridges non-reactive state that changes outside Svelte (typically per
 * render tick, e.g. game-loop values) into a reactive read, refreshed on a
 * throttled interval instead of on every source write.
 *
 * The interval and its cleanup live here so components stay declarative.
 * `$state.raw` fits the snapshot because updates are wholesale
 * reassignments, never deep mutations.
 *
 * Must be called during component initialization (owns an `$effect`).
 */
export function createPolled<T>(read: () => T, interval = 100) {
	let value = $state.raw<T>(read());

	$effect(() => {
		const id = setInterval(() => (value = read()), interval);
		return () => clearInterval(id);
	});

	return {
		get value() {
			return value;
		}
	};
}
