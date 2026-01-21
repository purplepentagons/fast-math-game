game.addButtonListeners = function() {
	game.addDifficultyListeners();
	game.addModeTypeListeners();
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

game.updateModeTypes = function() {
	let modeTypes = document.querySelectorAll(".mode-type");

	function replaceModeTypes(values) {
		let modeTypesParent = document.querySelector(".mode-types");
		
		if (values.length == 0) {
			modeTypesParent.classList.add("hidden");
			return;
		} else {
			modeTypesParent.classList.remove("hidden");
		}

		for (let modeType of modeTypes) {
			modeType.remove();
		}

		for (let value of values) {
			const newModeType = document.createElement("div");
			newModeType.classList.add("mode-type")
			newModeType.classList.add("gray")
			newModeType.setAttribute("data-mode", value)
			newModeType.textContent = value;

			modeTypesParent.append(newModeType);
		}

		game.addModeTypeListeners();

		document.querySelector(".mode-type").classList.remove("gray");
	}

	// i would use a switch statement inside the function's arguments but this isn't Rust
	switch (game.questionMode) {
		case 0: {
			replaceModeTypes(["Free", "Timed"]);
			game.questionModeType = "Free";
			break;
		}

		case 1: {
			replaceModeTypes([10, 30, 60]);
			game.questionModeType = 10;
			break;
		}

		case 2: {
			replaceModeTypes([10, 25, 50, 100]);
			game.questionModeType = 10;
			break;
		}

		case 3: {
			replaceModeTypes([-0.5, -1, -2]);
			game.questionModeType = -0.5;
			break;
		}
	}
}

game.addTypeListeners = function() {
	let types = document.querySelectorAll(".type");

	for (let type of types) {
		type.onclick = () => {
			if (game.questionTypes.length == 1 && type.getAttribute("data-mode") == game.questionTypes[0] ) {
				return;
			}
			
			let mode = Number(type.getAttribute("data-mode"))
			type.classList.toggle("gray")

			if (game.questionTypes.includes(mode)) {
				game.questionTypes = game.questionTypes.filter((n) => n != mode);
			} else {
				game.questionTypes = game.questionTypes.concat(mode);
			}
			
			game.startGame();

			game.question = game.makeQuestion();
			game.updateQuestion();
		}
	};
}

game.addDifficultyListeners = function() {
	let difficulties = document.querySelectorAll(".difficulty");

	for (let difficulty of difficulties) {
		difficulty.onclick = () => {
			game.mutuallyExcludeButtons(difficulty, difficulties)

			game.questionDifficulty = Number(difficulty.getAttribute("data-mode"))

			game.startGame();

			game.question = game.makeQuestion();
			game.updateQuestion();
		}
	};
}

game.addModeListeners = function() {
	let modes = document.querySelectorAll(".mode");

	for (let mode of modes) {
		mode.onclick = () => {
			game.mutuallyExcludeButtons(mode, modes)

			game.questionMode = Number(mode.getAttribute("data-mode"))

			game.updateModeTypes(mode);

			game.startGame();

			game.question = game.makeQuestion();
			game.updateQuestion();
		}
	};
}

game.addModeTypeListeners = function() {
	let modeTypes = document.querySelectorAll(".mode-type");

	for (let m of modeTypes) {
		m.onclick = () => {
			game.mutuallyExcludeButtons(m, modeTypes)

			game.questionModeType = m.getAttribute("data-mode");

			game.question = game.makeQuestion();
			game.updateQuestion();
			
			game.startGame();
		}
	};
}