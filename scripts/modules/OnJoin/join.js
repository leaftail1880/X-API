import { Player, world } from "@minecraft/server";
import { IS, setPlayerInterval, XA } from "xapi.js";
import { Database } from "../../lib/Database/Entity.js";
import { __JOIN_EMITTERS } from "./events.js";
import "./subscribes.js";
import { CONFIG_JOIN } from "./var.js";

/** @type {Database<string, IJoinData>} */
const PDB = new Database("player");

/**
 *
 * @param {Player | string} player
 * @returns
 */
function getKeyPlayerDBkey(player) {
	return `JOIN:${player instanceof Player ? player.id : player}`;
}

const isModified = Symbol("modified");

/**
 *
 * @param {Player | string} player
 * @returns {IJoinData}
 */
function getData(player) {
	const data = PDB.get(getKeyPlayerDBkey(player)) ?? { learning: 1, joined: Date.now() };
	// let modified = false;
	// const proxy = {};
	// Object.defineProperty(proxy, isModified, {
	// 	enumerable: true,
	// 	configurable: false,
	// 	get: () => modified,
	// });
	// for (const key in data) {
	// 	Object.defineProperty(proxy, key, {
	// 		enumerable: true,
	// 		configurable: false,
	// 		get() {
	// 			return data[key];
	// 		},
	// 		set(v) {
	// 			modified = true;
	// 			data[key] = modified;
	// 		},
	// 	});
	// }
	return data;
}
/**
 *
 * @param {Player | string} player
 * @param {IJoinData} data
 * @returns
 */
function setData(player, data) {
	return PDB.set(getKeyPlayerDBkey(player), data);
}

world.events.playerJoin.subscribe(async (data) => {
	const D = getData(data.player);
	D.waiting = 1;
	setData(data.player, D);
});

setPlayerInterval(
	(player) => {
		const data = getData(player);
		let modified = false;

		if (data.waiting === 1) {
			// New player (player joined)
			delete data.waiting;
			data.message = 1;
			data.at = player.location.x + " " + player.location.y + " " + player.location.z;
			modified = true;
		}

		// Pos where player joined
		const at = data.at;

		if (typeof at === "string") {
			const pos = at.split(" ").map(parseFloat);
			const not_moved = player.location.x === pos[0] && player.location.y === pos[1] && player.location.z === pos[2];

			if (not_moved) {
				// Player still stays at joined position...
				if (player.hasTag("on_ground")) {
					// Player doesnt falling down, show animation
					data.stage = data.stage ?? -1;
					data.stage++;
					if (typeof data.stage !== "number" || data.stage >= CONFIG_JOIN.animation.stages.length) data.stage = 0;

					// Creating title
					let title = CONFIG_JOIN.animation.stages[data.stage];
					for (const key in CONFIG_JOIN.animation.vars) {
						title = title.replace("$" + key, CONFIG_JOIN.animation.vars[key]);
					}

					// Show actionBar
					if (CONFIG_JOIN.actionBar) player.onScreenDisplay.setActionBar(CONFIG_JOIN.actionBar);

					// Title + subtitle
					/** @type {import("@minecraft/server").TitleDisplayOptions} */
					const options = {
						fadeInSeconds: 0,
						fadeOutSeconds: 1,
						staySeconds: 2,
					};
					if (CONFIG_JOIN.subtitle) options.subtitle = CONFIG_JOIN.subtitle;
					// Show...
					player.onScreenDisplay.setTitle(title, options);
				} else {
					// Player joined in air
					JOIN(player, data, "air");
				}
			} else if (data.message) {
				// Player moved on ground
				JOIN(player, data, "ground");
			}
			modified = true;
		}
		if (data.learning && !data.message) {
			// Show first time join guide
			__JOIN_EMITTERS.PlayerGuide.emit(player);
			delete data.learning;
			modified = true;
		}

		if (modified) setData(player, data);
	},
	20,
	"joinInterval"
);

const getSettings = XA.PlayerOptions("join", {
	message: { desc: "?????????????????? ?? ?????????? ???????????? ??????????????", value: true },
	sound: { desc: "???????? ?????????? ???????????? ??????????????", value: true },
});

/**
 *
 * @param {Player} player
 * @param {IJoinData} data
 * @param {"air" | "ground"} messageType
 */
function JOIN(player, data, messageType) {
	delete data.at;
	delete data.stage;
	delete data.message;

	data.times = (data.times ?? 0) + 1;

	for (const plr of world.getPlayers()) {
		if (plr.id === player.id) continue;
		const settings = getSettings(plr);
		if (settings.sound) plr.playSound(CONFIG_JOIN.onJoin.sound);
		if (settings.message) plr.tell(`??7${player.name} ${CONFIG_JOIN.onJoin[messageType]}`);
	}

	if (!data.learning) __JOIN_EMITTERS.PlayerJoin.emit(player);
	player.onScreenDisplay.clearTitle();

	const oldTag = data.name;

	if (oldTag === player.name) return;
	if (oldTag && oldTag !== player.name) {
		world.say("??c> ??3?????????? ??f" + oldTag + " ??r??3???????????? ?????? ???? ??f" + player.name);
	}

	data.name = player.name;
}

new XA.Command({
	name: "info",
	description: "?????????????????? ????????",
	type: "public",
}).executes((ctx) => {
	const D = getData(ctx.sender);
	D.learning = 1;
	setData(ctx.sender, D);
});

new XA.Command({
	name: "join",
	requires: (p) => IS(p.id, "admin"),
	description: "?????????????????? ????????",
	type: "public",
}).executes((ctx) => {
	const D = getData(ctx.sender);
	D.waiting = 1;
	setData(ctx.sender, D);
});
