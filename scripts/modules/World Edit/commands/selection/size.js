import { IS, XA } from "xapi.js";
import { SelectionBuild } from "../../modules/builders/SelectionBuilder.js";
import { WorldEditBuild } from "../../modules/builders/WorldEditBuilder.js";

new XA.Command({
	type: "wb",
	name: "size",
	description: "Получет информация о выделенной зоне",
	requires: (p) => IS(p.id, "moderator"),
}).executes((ctx) => {
	ctx.reply(`В выделенной зоне ${XA.Utils.getBlocksCount(WorldEditBuild.pos1, WorldEditBuild.pos2)} блоков`);
});
