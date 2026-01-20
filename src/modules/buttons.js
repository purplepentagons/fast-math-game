import { makeQuestion, updateQuestion } from "./questions.js";
import { endGame, startGame, updateScore } from "./logic.js";

export function addButtonListeners() {
	addDifficultyListeners();
	addModeTypeListeners();
	addTypeListeners();
	addModeListeners();

	let retryButton = document.querySelector(".restart");

	retryButton.onclick = () => {
		startGame();
	}
}

function mutuallyExcludeButtons(button, buttonList) {
	for (let e of buttonList) {
		e.classList.add("gray")
	}
	button.classList.remove("gray")
}

function updateModeTypes(mode) {
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

		addModeTypeListeners();

		document.querySelector(".mode-type").classList.remove("gray");
	}

	// i would use a switch statement inside the function's arguments but this isn't Rust
	switch (questionMode) {
		case 0: {
			replaceModeTypes(["Free", "Timed"])
			questionModeType = "Free";
			break;
		}

		case 1: {
			replaceModeTypes([10, 30, 60])
			questionModeType = 10;
			break;
		}

		case 2: {
			replaceModeTypes([10, 25, 50, 100])
			questionModeType = 10;
			break;
		}

		case 3: {
			replaceModeTypes([-0.5, -1, -2])
			questionModeType = -0.5;
			break;
		}
	}
}

function addTypeListeners() {
	let types = document.querySelectorAll(".type");

	for (let type of types) {
		type.onclick = () => {
			if (questionTypes.length == 1 && type.getAttribute("data-mode") == questionTypes[0] ) {
				return;
			}
			
			let mode = Number(type.getAttribute("data-mode"))
			type.classList.toggle("gray")

			if (questionTypes.includes(mode)) {
				questionTypes = questionTypes.filter((n) => n != mode);
			} else {
				questionTypes = questionTypes.concat(mode);
			}
			
			startGame();

			question = makeQuestion();
			updateQuestion();
		}
	};
}

function addDifficultyListeners() {
	let difficulties = document.querySelectorAll(".difficulty");

	for (let difficulty of difficulties) {
		difficulty.onclick = () => {
			mutuallyExcludeButtons(difficulty, difficulties)

			questionDifficulty = Number(difficulty.getAttribute("data-mode"))

			startGame();

			question = makeQuestion();
			updateQuestion();
		}
	};
}

function addModeListeners() {
	let modes = document.querySelectorAll(".mode");

	for (let mode of modes) {
		mode.onclick = () => {
			mutuallyExcludeButtons(mode, modes)

			questionMode = Number(mode.getAttribute("data-mode"))

			updateModeTypes(mode);

			startGame();

			question = makeQuestion();
			updateQuestion();
		}
	};
}

function addModeTypeListeners() {
	let modeTypes = document.querySelectorAll(".mode-type");

	for (let m of modeTypes) {
		m.onclick = () => {
			mutuallyExcludeButtons(m, modeTypes)

			questionModeType = m.getAttribute("data-mode");

			question = makeQuestion();
			updateQuestion();
			
			startGame();
		}
	};
}