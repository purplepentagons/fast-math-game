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

game.addKeyListener = function() {

	const answerElement = document.querySelector(".answer");

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
	const answerElement = document.querySelector(".answer");
	const throbber = document.querySelector(".throbber");

	answerElement.classList.add("gray");
	throbber.classList.add("hidden");
			
	game.answer = game.placeholder;

	answerElement.textContent = game.answer;
}

game.removePlaceholder = function() {
	const answerElement = document.querySelector(".answer");
	const throbber = document.querySelector(".throbber");

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
