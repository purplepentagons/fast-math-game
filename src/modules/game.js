globalThis.game = {
	currentScreen: 1,
	gameStarted: false,
	currentTime: Date.now(),

	question: {
		display: "You shouldn't be seeing this.",
		answer: 67,
	},
	questionTimeMs: 10000,

	answer: "",
	isNegative: false,
	isPlaceholder: true,

	placeholder: "Answer here...",

	score: 0,
	scoreNoun: "Score",

	// for consecutive mode
	questionsToAnswer: 0,
	// for endurance and timed mode
	timeoutID: 0
}

const answerElement = document.querySelector(".answer");
const throbber = document.querySelector(".throbber");

game.addKeyListener = function() {

	document.onkeydown = (e) => {

		if (game.currentScreen != 0) {
			return;
		}

		if (!game.gameStarted) {
			game.gameStarted = true;

			game.unpauseGame();
		}

		let keyCode = e.code;
		let numberKeyPressed= keyCode.startsWith("Digit");

		game.isPlaceholder = game.answer == game.placeholder;

		switch (true) {
			case numberKeyPressed: {
				game.removePlaceholder();
				let number = keyCode.charAt(5);
				game.answer = game.answer.concat(number).slice(0, 50);

				break;
			}
			
			case (keyCode == "Minus"): {
				game.removePlaceholder();
				game.isNegative = !game.isNegative;
				break;
			}

			case (keyCode == "Backspace" && !game.isPlaceholder): {
				if (game.answer == "") {
					game.resetSign();
				}

				if (e.ctrlKey) {
					game.setAnswerToPlaceholder();
					game.resetSign();
				} else {
					game.answer = game.answer.slice(0, -1);
				}

				break;
			}

			case (game.answer == "" && !numberKeyPressed): {
				game.setAnswerToPlaceholder();
				break;
			}
		}

		game.checkAnswer();
		
		answerElement.textContent = (
			(game.isNegative && game.answer != game.placeholder) ? "-" : (game.answer == "" ? "\u200B" : ""))
		+ game.answer;
	};
}

game.setAnswerToPlaceholder = function() {
	answerElement.classList.add("gray");
	throbber.classList.add("hidden");
			
	game.answer = game.placeholder;

	answerElement.textContent = game.answer;
}

game.removePlaceholder = function() {
	if (game.isPlaceholder) {
			game.answer = "";
	}

	answerElement.classList.remove("gray");
	throbber.classList.remove("hidden");
}

game.resetSign = function() {
	game.isNegative = false;
}

game.checkAnswer = function() {
	if (game.answer === "") {
		return;
	}

	let answerIsCorrect = ((1 - 2 * Number(game.isNegative)) * game.answer) == game.question.answer;

	if ( answerIsCorrect ) {
		game.resetSign();

		game.setAnswerToPlaceholder();
		game.question = game.makeQuestion();

		game.updateScore(true);

		game.currentTime = Date.now();

		game.updateQuestion();

		if (game.questionMode != 1) {
			game.animateProgressBar(game.questionTimeMs);
		}
		
		if (game.questionMode == 3) {
			clearTimeout(game.timeoutID);
			game.setEnduranceTimeout();
		}
	}	
}

game.setEnduranceTimeout = function() {
	game.timeoutID = setTimeout(() => {
		game.endGame();
	}, game.questionTimeMs);
}

game.updateScore = function(answered) {
	const scoreElement = document.querySelector(".score");

	if (answered) {

		const scoreEarned = Math.max(0, game.currentTime - Date.now() + game.questionTimeMs)
		
		switch(game.questionMode) {
			case 0: {
				if (game.questionModeType == "Free") {
					game.score++;
				} else if (game.questionModeType == "Timed") {
					game.score += scoreEarned;
				}
				break;
			}

			case 1: {
				game.score += scoreEarned;
				break;
			}

			case 2: {
				game.score += scoreEarned;
				if (game.questionsToAnswer > 1) {
					game.questionsToAnswer--
				} else {
					game.endGame();
				}
				break;
			}

			case 3: {
				if (scoreEarned == 0 || game.questionTimeMs <= 0) {
					game.endGame();
					return;
				}
				game.score++;
				if (scoreEarned < (game.questionTimeMs / 2)) {
					game.questionTimeMs += 1000*game.questionModeType;
				}
				break;
			}
		}

		if (game.score != 0) {
			scoreElement.animate(
				{color: ["#AFA", "#CCF"]},250
			)
		}
	}

	scoreElement.textContent = `${game.scoreNoun}: ${game.score}`;
}

game.displayScreen = function(screen) {
	const screens = document.querySelectorAll(".center");

	const selectedScreen = document.querySelector(`[data-screen=\"${screen}\"]`);

	game.currentScreen = screen;

	for (let s of screens) {
		s.classList.add("hidden");
	}

	selectedScreen.classList.remove("hidden");
}

game.unpauseGame = function() {
	game.currentTime = Date.now();

	if (game.questionMode == 1) {
		game.animateProgressBar(game.questionModeType*1000);
		game.timeoutID = setTimeout(() => {
			game.endGame();
		}, game.questionModeType*1000);
	} else if (game.questionMode == 3) {
		game.setEnduranceTimeout();
	}

	game.animateProgressBar(game.questionTimeMs);
}

game.startGame = function() {
	/* probably shouldn't drop the player into the fire immediately */
	/* i would like to add a feature that starts the timer as soon as the player begins typing */
	game.currentTime = Date.now();

	clearTimeout(game.timeoutID);

	game.gameStarted = false;

	switch(game.questionMode) {
			case 0: {
				if (game.questionModeType == "Free") {
					game.questionTimeMs = 1e+20;
					game.scoreNoun = "Questions Answered"
				} else if (game.questionModeType == "Timed") {
					game.questionTimeMs = 10000;
					game.scoreNoun = "Score"
				}
				break;
			}

			case 1: {
				game.questionTimeMs = game.questionModeType*1000;
				game.scoreNoun = "Score"
				break;
			}

			case 2: {
				game.questionTimeMs = 10000;
				game.scoreNoun = "Score"
				game.questionsToAnswer = game.questionModeType;
				break;
			}

			case 3: {
				game.questionTimeMs = 10000;
				game.scoreNoun = "Questions Answered"
				break;
			}
	}
	game.score = 0;

	game.resetSign();
	game.animateProgressBar(1e20);
	game.displayScreen(0);
	game.question = game.makeQuestion();
	game.updateQuestion();
	game.setAnswerToPlaceholder();
	game.updateScore(false);
}

game.endGame = function() {
	const scoreTitleElement = document.querySelector(".title-score");
	const questionTitleElement = document.querySelector(".title-questions");
	const modeTitleElement = document.querySelector(".title-mode");
	const difficultyTitleElement = document.querySelector(".title-difficulty");
	
	let questionTypesTitle = "";

	for (let t of game.questionTypes) {
		questionTypesTitle = questionTypesTitle.concat(["Multiplication", "Addition", "Subtraction"][t]);
	}

	scoreTitleElement.textContent = game.score;
	questionTitleElement.textContent = questionTypesTitle;
	modeTitleElement.textContent = [
		"Freedom",
		"Timed",
		"Consecutive",
		"Endurance"
	][game.questionMode] + " " + game.questionModeType.toString();
	difficultyTitleElement.textContent = [
		"Easy",
		"Difficult",
		"Cero Miedo"
	][game.questionDifficulty];  

	game.displayScreen(1);
}

