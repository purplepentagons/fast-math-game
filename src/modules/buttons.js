game.addButtonListeners = function() {
	game.addDifficultyListeners();
	game.addModeDifficultyListeners();
	game.addTypeListeners();
	game.addModeListeners();

	let retryButton = document.querySelector(".restart");

	retryButton.onclick = () => {
		game.startGame();
	}
}

game.mutuallyExcludeButtons = function(button, buttonList) {
	for (let e of buttonList) {
		e.classList.add("gray")
	}
	button.classList.remove("gray")
}

game.updateModeDifficulties = function() {
	let modeDifficultyButtons = document.querySelectorAll(".mode-difficulty");

	function replaceModeDifficulties(values) {
		let modeDifficultiesParent = document.querySelector(".mode-difficulties");
		
		if (values.length == 0) {
			modeDifficultiesParent.classList.add("hidden");
			return;
		} else {
			modeDifficultiesParent.classList.remove("hidden");
		}

		for (let modeType of modeDifficultyButtons) {
			modeType.remove();
		}

		for (let value of values) {
			const newModeDifficulty = document.createElement("div");
			newModeDifficulty.classList.add("mode-difficulty")
			newModeDifficulty.classList.add("gray")
			newModeDifficulty.setAttribute("data-mode", value)
			newModeDifficulty.textContent = value;

			modeDifficultiesParent.append(newModeDifficulty);
		}

		game.addModeDifficultyListeners();

		document.querySelector(".mode-difficulty").classList.remove("gray");
	}

	// i would use a switch statement inside the function's arguments but this isn't Rust
	switch (game.settings.mode) {
		case 0: {
			replaceModeDifficulties(["Free", "Timed"]);
			game.settings.modeDifficulty = "Free";
			break;
		}

		case 1: {
			replaceModeDifficulties([10, 30, 60]);
			game.settings.modeDifficulty = 10;
			break;
		}

		case 2: {
			replaceModeDifficulties([10, 25, 50, 100]);
			game.settings.modeDifficulty = 10;
			break;
		}

		case 3: {
			replaceModeDifficulties([-0.5, -1, -2]);
			game.settings.modeDifficulty = -0.5;
			break;
		}
	}
}

game.addTypeListeners = function() {
	let typeButtons = document.querySelectorAll(".type");

	for (let tb of typeButtons) {
		tb.onclick = () => {
			if (game.settings.questions.length == 1 && tb.getAttribute("data-mode") == game.settings.questions[0] ) {
				return;
			}
			
			let mode = Number(tb.getAttribute("data-mode"))
			tb.classList.toggle("gray")

			if (game.settings.questions.includes(mode)) {
				game.settings.questions = game.settings.questions.filter((n) => n != mode);
			} else {
				game.settings.questions = game.settings.questions.concat(mode);
			}
			
			game.startGame();

			game.question = game.makeQuestion();
			game.updateQuestion();
		}
	};
}

game.addDifficultyListeners = function() {
	let difficultyButtons = document.querySelectorAll(".difficulty");

	for (let db of difficultyButtons) {
		db.onclick = () => {
			game.mutuallyExcludeButtons(db, difficultyButtons)

			game.settings.difficulty = Number(db.getAttribute("data-mode"))

			game.startGame();

			game.question = game.makeQuestion();
			game.updateQuestion();
		}
	};
}

game.addModeListeners = function() {
	let modeButtons = document.querySelectorAll(".mode");

	for (let mb of modeButtons) {
		mb.onclick = () => {
			game.mutuallyExcludeButtons(mb, modeButtons)

			game.settings.mode = Number(mb.getAttribute("data-mode"))

			game.updateModeDifficulties(mb);

			game.startGame();

			game.question = game.makeQuestion();
			game.updateQuestion();
		}
	};
}

game.addModeDifficultyListeners = function() {
	let modeDifficultyButtons = document.querySelectorAll(".mode-difficulty");

	for (let mdb of modeDifficultyButtons) {
		mdb.onclick = () => {
			game.mutuallyExcludeButtons(mdb, modeDifficultyButtons)

			game.settings.modeDifficulty = mdb.getAttribute("data-mode");

			game.question = game.makeQuestion();
			game.updateQuestion();
			
			game.startGame();
		}
	};
}