import { __MODULES__ } from "./loader.js";

export class Module {
  /**
   *
   * @param {string} folderName
   * @param {ModuleOptions} [options]
   */
  constructor(folderName, options = {}) {
    this.folder = folderName;

    this.path = options.path ?? "./modules/";
    this.file = options.fileName ?? "index";
    this.condition = options.condition ?? true;

    if (this.condition)
      __MODULES__[this.path + this.folder + "/" + this.file + ".js"] =
        folderName;
  }
}
