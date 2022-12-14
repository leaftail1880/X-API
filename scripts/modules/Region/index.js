import { MinecraftEffectTypes } from "@minecraft/server";
import { setPlayerInterval, ThrowError, XA } from "xapi.js";

const DB = XA.tables.basic;
const key = "server.type";

const VALUE = {
	0: "build",
	1: "survival",
};
const toDefault = () => {
	DB.set(key, 0);
	return 0;
};

(async () => {
	/** @type {"build" | "survival"} */
	const type = VALUE[(await DB.getSync(key)) ?? toDefault()];

	if (type !== "build" && type !== "survival") {
		toDefault();
		ThrowError(new TypeError("Invalid region type: " + type));
	}

	if (type === "build") import("./Build/index.js");
	else if (type === "survival") import("./Survival/index.js");
})();

setPlayerInterval(
	(player) => {
		if (player.location.y >= -61) return;
		if (player.location.y < -60) player.addEffect(MinecraftEffectTypes.levitation, 2, 5, false);
		if (player.location.y < -63)
			player.teleport(
				{ x: player.location.x, y: -60, z: player.location.z },
				player.dimension,
				player.rotation.x,
				player.rotation.y
			);
	},
	0,
	"underground effects"
);
