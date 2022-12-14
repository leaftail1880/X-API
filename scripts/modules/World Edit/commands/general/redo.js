import { IS, XA } from "xapi.js";
import { WorldEditBuild } from "../../modules/builders/WorldEditBuilder.js";

new XA.Command({
	type: "wb",
	name: "redo",
	description: "Возвращает последнее действие (из памяти)",
	requires: (p) => IS(p.id, "moderator"),
})
	.int("redoCount", true)
	.executes((ctx, r) => {
		const status = WorldEditBuild.redo(!isNaN(r) ? r : 1);
		if (status) ctx.reply(status);
	});
