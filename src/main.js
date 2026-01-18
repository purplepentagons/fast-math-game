import { takeInput } from "./modules/logic.js";
import { addButtonListeners } from "./modules/buttons.js";

document.addEventListener("DOMContentLoaded", () => {
	takeInput();
	addButtonListeners();
});