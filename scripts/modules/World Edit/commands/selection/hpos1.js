import { IS, XA } from "xapi.js";
import { WorldEditBuild } from "../../modules/builders/WorldEditBuilder.js";

new XA.Command({
	type: "wb",
	name: "hpos1",
	description: "Set position 1 to targeted block",
	requires: (p) => IS(p.id, "moderator"),
}).executes((ctx) => {
	const pos = ctx.sender.getBlockFromViewVector().location;
	if (!pos) return ctx.reply("Неа!");
	WorldEditBuild.pos1 = pos;
	ctx.reply(`§5Позиция§r 1 теперь ${pos.x}, ${pos.y}, ${pos.z}`);
});
