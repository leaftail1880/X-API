import { Player } from "@minecraft/server";
import { MessageFormData, MessageFormResponse } from "@minecraft/server-ui";
import { handle } from "../../xapi.js";
import { XShowForm } from "./utils.js";
/** */
export class MessageForm {
	/**
	 *  the title that this form should have
	 * @type {string}
	 */
	title;
	/**
	 * extra text that should be displayed in the form
	 * @type {string}
	 */
	body;
	/**
	 * The default minecraft form this form is based on
	 * @type {MessageFormData}
	 * @private
	 */
	form;
	/**
	 * the first button of the dialog.
	 * @type {IMessageFormButton}
	 * @private
	 */
	button1;
	/**
	 * the seccond button of the dialog.
	 * @type {IMessageFormButton}
	 * @private
	 */
	button2;
	/**
	 * Creates a new form to be shown to a player
	 * @param {string} title the title that this form should have
	 * @param {string} body extra text that should be displayed in the form
	 */
	constructor(title, body) {
		this.title = title;
		this.body = body;
		this.form = new MessageFormData();
		if (title) this.form.title(title);
		if (body) this.form.body(body);
		this.triedToShow = 0;
	}
	/**
	 * Method that sets the text for the first button of the dialog.
	 * @param {string} text  text to show on this button
	 * @param {ButtonCallback} callback  what happens when this button is clicked
	 * @example ```
	 * setButton1("settings", () => {})
	 * ```
	 * @returns {MessageForm}
	 */
	setButton1(text, callback) {
		this.button1 = { text: text, callback: callback };
		this.form.button1(text);
		return this;
	}
	/**
	 * Method that sets the text for the second button of the dialog.
	 * @param {string} text  text to show on this button
	 * @param {ButtonCallback} callback  what happens when this button is clicked
	 * @example ```
	 * setButton2("settings", () => {})
	 * ```
	 * @returns {MessageForm}
	 */
	setButton2(text, callback) {
		this.button2 = { text: text, callback: callback };
		this.form.button2(text);
		return this;
	}
	/**
	 * Shows this form to the player
	 * @param {Player} player  player to show to
	 * @returns {Promise<void>}
	 */
	async show(player) {
		const response = await XShowForm(this.form, player);
		if (response === false || !(response instanceof MessageFormResponse)) return;
		if (response.selection === 1) handle(this.button1?.callback, null, ["MessageFormCallback"]);
		if (response.selection === 0) handle(this.button2?.callback, null, ["MessageFormCallback"]);
	}
}
