import { addKeyListener, startGame } from "./modules/logic.js";
import { addButtonListeners } from "./modules/buttons.js";

document.addEventListener("DOMContentLoaded", () => {
	addKeyListener();
	addButtonListeners();

	startGame();
});