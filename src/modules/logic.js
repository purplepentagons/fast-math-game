import { animateProgressBar, makeQuestion, updateQuestion } from "./questions.js";

 
// Screen 0 - Game
// Screen 1 - Stats Screen 

globalThis.currentScreen = 1;
globalThis.gameStarted = false;

globalThis.question = makeQuestion();
globalThis.isNegative = false;
globalThis.answer = "";

globalThis.score = 0;
globalThis.scoreNoun = "Score";

globalThis.questionTimeMs = 10000;

// for consecutive mode
globalThis.questionsToAnswer = 0;
// for endurance mode
globalThis.enduranceTimeoutID = 0;

const answerElement = document.querySelector(".answer");
const throbber = document.querySelector(".throbber");
const placeholder = "Answer here..."

let isPlaceholder = true;
let currentTime = Date.now();

export function addKeyListener() {

	document.onkeydown = (e) => {

		if (currentScreen != 0) {
			return;
		}

		if (!gameStarted) {
			gameStarted = true;

			unpauseGame();
		}

		let keyCode = e.code;
		let numberKeyPressed= keyCode.startsWith("Digit");

		isPlaceholder = answer == placeholder;

		switch (true) {
			case numberKeyPressed: {
				removePlaceholder();
				let number = keyCode.charAt(5);
				answer = answer.concat(number).slice(0, 50);

				break;
			}
			
			case (keyCode == "Minus"): {
				removePlaceholder();
				isNegative = !isNegative;
				break;
			}

			case (keyCode == "Backspace" && !isPlaceholder): {
				if (answer == "") {
					resetSign();
				}

				if (e.ctrlKey) {
					setAnswerToPlaceholder();
					resetSign();
				} else {
					answer = answer.slice(0, -1);
				}

				break;
			}

			case (answer == "" && !numberKeyPressed): {
				setAnswerToPlaceholder();
				break;
			}
		}

		checkAnswer();
		
		answerElement.textContent = (
			(isNegative && answer != placeholder) ? "-" : (answer == "" ? "\u200B" : ""))
		+ answer;
	};
}

function setAnswerToPlaceholder() {
	answerElement.classList.add("gray");
	throbber.classList.add("hidden");
			
	answer = placeholder;

	answerElement.textContent = answer;
}

function removePlaceholder() {
	if (isPlaceholder) {
			answer = "";
	}

	answerElement.classList.remove("gray");
	throbber.classList.remove("hidden");
}

function resetSign() {
	isNegative = false;
}

function checkAnswer() {
	let answerIsCorrect = ((1 - 2 * Number(isNegative)) * answer) == question.answer;

	if ( answerIsCorrect ) {
		resetSign();

		setAnswerToPlaceholder();
		question = makeQuestion();

		updateScore(true);

		currentTime = Date.now();

		updateQuestion();

		if (questionMode != 1) {
			animateProgressBar(questionTimeMs);
		}
		
		if (questionMode == 3) {
			clearTimeout(enduranceTimeoutID);
			setEnduranceTimeout();
		}
	}	
}

function setEnduranceTimeout() {
	enduranceTimeoutID = setTimeout(() => {
		endGame();
	}, questionTimeMs);
}

export function updateScore(answered) {
	const scoreElement = document.querySelector(".score");

	if (answered) {

		const scoreEarned = Math.max(0, currentTime - Date.now() + questionTimeMs)
		
		switch(questionMode) {
			case 0: {
				if (questionModeType == "Free") {
					score++;
				} else if (questionModeType == "Timed") {
					score += scoreEarned;
				}
				break;
			}

			case 1: {
				score += scoreEarned;
				break;
			}

			case 2: {
				score += scoreEarned;
				if (questionsToAnswer > 1) {
					questionsToAnswer--
				} else {
					endGame();
				}
				break;
			}

			case 3: {
				if (scoreEarned == 0 || questionTimeMs <= 0) {
					endGame();
					return;
				}
				score++;
				if (scoreEarned < (questionTimeMs / 2)) {
					questionTimeMs += 1000*questionModeType;
				}
				break;
			}
		}

		if (score != 0) {
			scoreElement.animate(
				{color: ["#AFA", "#CCF"]},250
			)
		}
	}

	scoreElement.textContent = `${scoreNoun}: ${score}`;
}

export function displayScreen(screen) {
	const screens = document.querySelectorAll(".center");

	const selectedScreen = document.querySelector(`[data-screen=\"${screen}\"]`);

	currentScreen = screen;

	for (let s of screens) {
		s.classList.add("hidden");
	}

	selectedScreen.classList.remove("hidden");
}

function unpauseGame() {
	currentTime = Date.now();

	if (questionMode == 1) {
		animateProgressBar(questionModeType*1000);
		setTimeout(() => {
			endGame();
		}, questionModeType*1000);
	} else if (questionMode == 3) {
		setEnduranceTimeout();
	}

	animateProgressBar(questionTimeMs);
}

export function startGame() {
	/* probably shouldn't drop the player into the fire immediately */
	/* i would like to add a feature that starts the timer as soon as the player begins typing */
	currentTime = Date.now();

	gameStarted = false;

	switch(questionMode) {
			case 0: {
				if (questionModeType == "Free") {
					questionTimeMs = 1e+20;
					scoreNoun = "Questions Answered"
				} else if (questionModeType == "Timed") {
					questionTimeMs = 10000;
					scoreNoun = "Score"
				}
				break;
			}

			case 1: {
				questionTimeMs = questionModeType*1000;
				scoreNoun = "Score"
				break;
			}

			case 2: {
				questionTimeMs = 10000;
				scoreNoun = "Score"
				questionsToAnswer = questionModeType;
				break;
			}

			case 3: {
				questionTimeMs = 10000;
				scoreNoun = "Questions Answered"
				break;
			}
	}
	score = 0;

	resetSign();
	animateProgressBar(1e20);
	displayScreen(0);
	updateQuestion();
	setAnswerToPlaceholder();
	updateScore(false);
}

export function endGame() {
	const scoreTitleElement = document.querySelector(".title-score");
	const questionTitleElement = document.querySelector(".title-questions");
	const modeTitleElement = document.querySelector(".title-mode");
	const difficultyTitleElement = document.querySelector(".title-difficulty");
	
	let questionTypesTitle = "";

	for (let t of questionTypes) {
		questionTypesTitle = questionTypesTitle.concat(["Multiplication", "Addition", "Subtraction"][t]);
	}

	scoreTitleElement.textContent = score;
	questionTitleElement.textContent = questionTypesTitle;
	modeTitleElement.textContent = [
		"Freedom",
		"Timed",
		"Consecutive",
		"Endurance"
	][questionMode] + " " + questionModeType.toString();
	difficultyTitleElement.textContent = [
		"Easy",
		"Difficult",
		"Cero Miedo"
	][questionDifficulty];  

	displayScreen(1);
}

