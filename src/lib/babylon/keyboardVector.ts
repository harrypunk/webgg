import type { InputVectorSource } from './useMovement';

const KEY_TO_INPUT = {
	KeyW: 'up',
	KeyS: 'down',
	KeyA: 'left',
	KeyD: 'right'
} as const;

/**
 * WASD keyboard input source scoped to a single element (typically the game
 * canvas), so key events elsewhere in the DOM — menus, options dialogs —
 * stay free for their own shortcuts.
 *
 * The element is made focusable if it is not already (key events only reach
 * focused elements), and held keys reset on blur so input never sticks.
 */
export function useKeyboardVector(element: HTMLElement): InputVectorSource {
	const held = { up: false, down: false, left: false, right: false };

	const onKey = (e: KeyboardEvent) => {
		const dir = KEY_TO_INPUT[e.code as keyof typeof KEY_TO_INPUT];
		if (dir) held[dir] = e.type === 'keydown';
	};
	const onBlur = () => {
		held.up = held.down = held.left = held.right = false;
	};

	if (element.tabIndex < 0) element.tabIndex = 0;
	element.addEventListener('keydown', onKey);
	element.addEventListener('keyup', onKey);
	element.addEventListener('blur', onBlur);

	return {
		read: () => ({
			right: (held.right ? 1 : 0) - (held.left ? 1 : 0),
			forward: (held.up ? 1 : 0) - (held.down ? 1 : 0)
		}),
		detach: () => {
			element.removeEventListener('keydown', onKey);
			element.removeEventListener('keyup', onKey);
			element.removeEventListener('blur', onBlur);
		}
	};
}
