import type { Scene } from '@babylonjs/core/scene';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';

export interface InputState {
	up: boolean;
	down: boolean;
	left: boolean;
	right: boolean;
	fire: boolean;
}

export function createInputState(scene?: Scene): { state: InputState; dispose: () => void } {
	const state: InputState = {
		up: false,
		down: false,
		left: false,
		right: false,
		fire: false
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

	let pointerObserver: ReturnType<Scene['onPointerObservable']['add']> | undefined;

	if (scene) {
		pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
			if (pointerInfo.type === PointerEventTypes.POINTERDOWN && pointerInfo.event.button === 0) {
				state.fire = true;
			}
			if (pointerInfo.type === PointerEventTypes.POINTERUP && pointerInfo.event.button === 0) {
				state.fire = false;
			}
		});
	}

	function dispose() {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
		if (pointerObserver) {
			scene?.onPointerObservable.remove(pointerObserver);
		}
	}

	return { state, dispose };
}
