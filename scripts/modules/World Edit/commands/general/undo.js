import { IS, XA } from "xapi.js";
import { WorldEditBuild } from "../../modules/builders/WorldEditBuilder.js";

new XA.Command({
	type: "wb",
	name: "undo",
	description: "Отменяет последнее действие (из памяти)",
	requires: (p) => IS(p.id, "moderator"),
})
	.int("undoCount", true)
	.executes((ctx, r) => {
		const status = WorldEditBuild.undo(!isNaN(r) ? r : 1);
		ctx.reply(status);
	});
