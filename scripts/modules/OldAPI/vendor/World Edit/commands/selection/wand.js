import { XA } from "../../../../../../xapi.js";
import { SA } from "../../../../index.js";
//import { WorldEditBuild } from "../../modules/builders/WorldEditBuilder.js";

new XA.Command({
  /*type: "wb"*/
  name: "wand",
  description: "Выдет топор",
  requires: (p) => p.hasTag("commands"),
}).executes((ctx) => {
  ctx.sender.runCommand(`give @s we:wand`);
});
