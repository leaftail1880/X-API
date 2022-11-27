import { system } from "@minecraft/server";
import { handler } from "../xapi.js";

const AT = {};

/**
 * @param {number} ticks
 * @param {Function} callback
 * @param {boolean} [loop]
 * @param {number} [id]
 */
export function Timeout(ticks, callback, loop, id = Date.now()) {
	if (!AT[id]) AT[id] = 0;

	AT[id]++;

	if (AT[id] >= ticks) {
		AT[id] = 0;
		handler(callback, "Timeout");
		if (!loop) return;
	}

	if (AT[id] >= 0) system.run(() => Timeout(ticks, callback, loop, id));

	const stop = () => {
		AT[id] = -10;
	};
	return stop;
}
