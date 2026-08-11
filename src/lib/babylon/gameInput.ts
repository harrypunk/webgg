import type { InputVectorSource } from './useMovement';
import { useKeyboardVector } from './keyboardVector';
import { useGamepadVector } from './gamepadVector';

/**
 * The standard game input set: canvas-scoped WASD keyboard plus the gamepad
 * left stick, combined by the movement manager.
 */
export function createGameInputSources(canvas: HTMLElement): InputVectorSource[] {
	return [useKeyboardVector(canvas), useGamepadVector()];
}
