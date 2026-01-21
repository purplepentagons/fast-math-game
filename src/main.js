import "./modules/module.js"

document.addEventListener("DOMContentLoaded", () => {
	game.addKeyListener();
	game.addButtonListeners();

	game.startGame();
});