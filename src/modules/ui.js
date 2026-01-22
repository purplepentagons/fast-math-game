game.animateProgressBar = function(ms) {
	let barElement = document.querySelector(".progress");

	barElement.animate(
		{width: ["0%", "100%"]}, {
			duration: ms,
			fill: "forwards"
		}
	);
}

game.endGame = function() {
	const scoreTitleElement = document.querySelector(".title-score");
	const questionTitleElement = document.querySelector(".title-questions");
	const modeTitleElement = document.querySelector(".title-mode");
	const difficultyTitleElement = document.querySelector(".title-difficulty");
	
	let questionTypesTitle = "";

	for (let t of game.mode.questions) {
		questionTypesTitle = questionTypesTitle.concat(["Multiplication", "Addition", "Subtraction"][t]);
	}

	scoreTitleElement.textContent = game.score;
	questionTitleElement.textContent = questionTypesTitle;
	modeTitleElement.textContent = [
		"Freedom",
		"Timed",
		"Consecutive",
		"Endurance"
	][game.mode.mode] + " " + game.mode.modeDifficulty.toString();
	difficultyTitleElement.textContent = [
		"Easy",
		"Difficult",
		"Cero Miedo"
	][game.mode.difficulty];  

	game.displayScreen(1);
}

game.startGame = function() {
	/* probably shouldn't drop the player into the fire immediately */
	/* i would like to add a feature that starts the timer as soon as the player begins typing */
	game.currentTime = Date.now();

	clearTimeout(game.timeoutID);

	game.gameStarted = false;

	switch(game.mode.mode) {
			case 0: {
				if (game.mode.modeDifficulty == "Free") {
					game.questionTimeMs = 1e+20;
					game.scoreNoun = "Questions Answered"
				} else if (game.mode.modeDifficulty == "Timed") {
					game.questionTimeMs = 10000;
					game.scoreNoun = "Score"
				}
				break;
			}

			case 1: {
				game.questionTimeMs = game.mode.modeDifficulty*1000;
				game.scoreNoun = "Score"
				break;
			}

			case 2: {
				game.questionTimeMs = 10000;
				game.scoreNoun = "Score"
				game.questionsToAnswer = game.mode.modeDifficulty;
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

	if (game.mode.mode == 1) {
		game.animateProgressBar(game.mode.modeDifficulty*1000);
		game.timeoutID = setTimeout(() => {
			game.endGame();
		}, game.mode.modeDifficulty*1000);
	} else if (game.mode.mode == 3) {
		game.setEnduranceTimeout();
	}

	game.animateProgressBar(game.questionTimeMs);
}