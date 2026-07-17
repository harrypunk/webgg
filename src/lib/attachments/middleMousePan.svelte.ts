/**
 * Reports middle-mouse drag deltas (in CSS pixels) on a target element.
 * Pure DOM input: the caller decides what the deltas mean.
 *
 * Listeners for move/up are only attached while dragging. During a drag the
 * element gets pointer capture (so the drag continues outside it) and a
 * `grabbing` cursor.
 */
export function createMiddleMousePan(
	target: () => HTMLElement | undefined,
	onPan: (dxPx: number, dyPx: number) => void
) {
	$effect(() => {
		const el = target();
		if (!el) return;

		let lastX = 0;
		let lastY = 0;

		const onPointerMove = (e: PointerEvent) => {
			onPan(e.clientX - lastX, e.clientY - lastY);
			lastX = e.clientX;
			lastY = e.clientY;
		};

		const stop = (e: PointerEvent) => {
			el.style.cursor = '';
			if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', stop);
			el.removeEventListener('pointercancel', stop);
		};

		const onPointerDown = (e: PointerEvent) => {
			if (e.button !== 1) return; // middle button only
			e.preventDefault(); // suppress middle-click autoscroll
			lastX = e.clientX;
			lastY = e.clientY;
			el.style.cursor = 'grabbing';
			el.setPointerCapture(e.pointerId);
			el.addEventListener('pointermove', onPointerMove);
			el.addEventListener('pointerup', stop);
			el.addEventListener('pointercancel', stop);
		};

		const onAuxClick = (e: MouseEvent) => {
			if (e.button === 1) e.preventDefault();
		};

		el.addEventListener('pointerdown', onPointerDown);
		el.addEventListener('auxclick', onAuxClick);
		return () => {
			el.removeEventListener('pointerdown', onPointerDown);
			el.removeEventListener('auxclick', onAuxClick);
			el.removeEventListener('pointermove', onPointerMove);
			el.removeEventListener('pointerup', stop);
			el.removeEventListener('pointercancel', stop);
		};
	});
}
