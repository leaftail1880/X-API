import { BlockLocation, ItemStack, Location, MinecraftBlockTypes, Vector, world } from "@minecraft/server";
import { XA } from "xapi.js";
import { rd } from "../Airdrops/index.js";

export class LootChest {
	/**
	 *
	 * @param {number} posx
	 * @param {number} posz
	 * @param {number} loot_tier
	 */
	constructor(posx, posz, loot_tier = 1, rdrad) {
		this.pos = LootChest.summon(posx, posz, LootChest.getTable(loot_tier), rdrad);
	}
	static getTable(t) {
		/**
		 * @type {Array<ItemStack>}
		 */
		let array = XA.tables.drops.get("drop:" + t);
		if (!array) throw new Error("§cНет массива под именем: " + t);
		return array;
	}
	static summon(xz, zx, loot, rdrad) {
		let x,
			z,
			C = 0,
			block;
		while (!block && C < 150) {
			C++;
			x = rd(xz + rdrad, xz - rdrad);
			z = rd(zx + rdrad, zx - rdrad);
			/** @type {import("@minecraft/server").BlockRaycastOptions} */
			const q = {
				includeLiquidBlocks: false,
				includePassableBlocks: false,
				maxDistance: 100,
			};
			const b = world.getDimension("overworld").getBlockFromRay(new Location(x, 320, z), new Vector(0, -1, 0));
			if (b && b.location.y >= 50) {
				block = b.dimension.getBlock(new BlockLocation(b.location.x, b.location.y + 1, b.location.z));
				break;
			}
		}

		// TODO! LOOT

		if (!block) return false;
		block.setType(MinecraftBlockTypes.chest);

		return `${block.location.x} ${block.location.y} ${block.location.z}`;
	}
}
