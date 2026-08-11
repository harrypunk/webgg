import type { InputVectorSource } from './useMovement';

/**
 * Gamepad input source reading the left stick of the first connected
 * controller. Uses the W3C standard mapping, which covers Xbox and
 * DualShock/DualSense pads in modern browsers.
 *
 * Stateless polling — the Gamepad API is read-based, so there is nothing to
 * attach or detach; `read()` is simply called every render tick.
 */
export function useGamepadVector(deadZone = 0.15): InputVectorSource {
	return {
		read: () => {
			const pads = navigator.getGamepads?.() ?? [];
			for (const pad of pads) {
				if (!pad?.connected) continue;
				const x = pad.axes[0] ?? 0;
				// Stick up reports negative y — flip so y is "forward".
				const y = -(pad.axes[1] ?? 0);
				if (Math.hypot(x, y) < deadZone) return { x: 0, y: 0 };
				return { x, y };
			}
			return { x: 0, y: 0 };
		}
	};
}
