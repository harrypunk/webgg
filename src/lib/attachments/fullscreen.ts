import type { Attachment } from 'svelte/attachments';

export function fullscreen(target?: HTMLElement): Attachment {
	return (element) => {
		if (!target) return;
		const fullscreenTarget = target;

		function update() {
			const active = document.fullscreenElement === fullscreenTarget;
			element.classList.toggle('is-fullscreen', active);
			element.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
		}

		async function toggle(event: Event) {
			event.stopPropagation();
			try {
				if (document.fullscreenElement === fullscreenTarget) {
					await document.exitFullscreen();
				} else {
					await fullscreenTarget.requestFullscreen();
				}
			} catch (err) {
				console.error('Fullscreen toggle failed:', err);
			}
		}

		element.addEventListener('click', toggle);
		document.addEventListener('fullscreenchange', update);
		update();

		return () => {
			element.removeEventListener('click', toggle);
			document.removeEventListener('fullscreenchange', update);
		};
	};
}
