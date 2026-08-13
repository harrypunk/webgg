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
				const right = pad.axes[0] ?? 0;
				// Stick up reports negative y — flip so it reads as "forward".
				const forward = -(pad.axes[1] ?? 0);
				if (Math.hypot(right, forward) < deadZone) return { right: 0, forward: 0 };
				return { right, forward };
			}
			return { right: 0, forward: 0 };
		}
	};
}
