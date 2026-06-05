export interface InputState {
	up: boolean;
	down: boolean;
	left: boolean;
	right: boolean;
}

export function createInputState(): { state: InputState; dispose: () => void } {
	const state: InputState = {
		up: false,
		down: false,
		left: false,
		right: false
	};

	const keyMap: Record<string, keyof InputState> = {
		KeyW: 'up',
		ArrowUp: 'up',
		KeyS: 'down',
		ArrowDown: 'down',
		KeyA: 'left',
		ArrowLeft: 'left',
		KeyD: 'right',
		ArrowRight: 'right'
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const action = keyMap[e.code];
		if (action) state[action] = true;
	};

	const onKeyUp = (e: KeyboardEvent) => {
		const action = keyMap[e.code];
		if (action) state[action] = false;
	};

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);

	function dispose() {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	}

	return { state, dispose };
}
