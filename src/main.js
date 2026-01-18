import { takeInput } from "./modules/input.js";
import { addButtonListeners } from "./modules/questions.js";

document.addEventListener("DOMContentLoaded", () => {
	takeInput();
	addButtonListeners();
});