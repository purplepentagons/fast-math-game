import { takeInput } from "./modules/input.js";
import { addButtonListeners } from "./modules/buttons.js";

document.addEventListener("DOMContentLoaded", () => {
	takeInput();
	addButtonListeners();
});