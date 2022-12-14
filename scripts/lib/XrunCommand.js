import { world } from "@minecraft/server";
import { ThrowError } from "xapi.js";
import { DIMENSIONS } from "./List/dimensions.js";

/**
 * @typedef {{showOutput?: boolean; showError?: boolean; dimension?: "overworld" | "nether" | "the_end"}} ICommandOptions
 */

/**
 * Asynchornosly runs a command
 * @param {string} command Command to run
 * @param {ICommandOptions} [options] Options
 * @returns {Promise<number>}
 */
export async function XrunCommand(command, options) {
	try {
		const result = await DIMENSIONS[options?.dimension ?? "overworld"].runCommandAsync(command);
		if (options?.showOutput) world.say(result.successCount + "");
		return result.successCount;
	} catch (error) {
		if (options?.showError) ThrowError(error);
		return 0;
	}
}
