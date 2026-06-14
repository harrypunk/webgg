export type FullscreenController = ReturnType<typeof createFullscreen>;

export function createFullscreen(target: () => HTMLElement | undefined) {
	let active = $state(false);

	function update() {
		active = document.fullscreenElement === target();
	}

	$effect(() => {
		if (!target()) return;
		document.addEventListener('fullscreenchange', update);
		update();
		return () => document.removeEventListener('fullscreenchange', update);
	});

	async function toggle(event?: Event) {
		event?.stopPropagation();
		const el = target();
		if (!el) return;
		try {
			if (document.fullscreenElement === el) {
				await document.exitFullscreen();
			} else {
				await el.requestFullscreen();
			}
		} catch (err) {
			console.error('Fullscreen toggle failed:', err);
		}
	}

	return {
		get isFullscreen() {
			return active;
		},
		toggle
	};
}
