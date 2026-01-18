import { makeQuestion } from "./questions.js";

globalThis.question = makeQuestion();
globalThis.score = 0;
globalThis.isNegative = false;
globalThis.answer = "";


globalThis.questionTimeMs = 10000;

export function takeInput() {
	
	let answerElement = document.querySelector(".answer");
	let minusElement = document.querySelector(".sign");
	let throbber = document.querySelector(".throbber");

	let currentTime = Date.now();

	updateQuestion(globalThis.question);

	document.onkeydown = (e) => {

		let placeholder = "Answer here..."
		let keyCode = e.code;
		let numberKeyPressed= keyCode.startsWith("Digit");
		let isPlaceholder = answer == placeholder;
		
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

		switch (true) {
			case numberKeyPressed: {

				removePlaceholder();
				let number = keyCode.charAt(5);
				answer = answer.concat(number).slice(0, 50);
				console.log(number, answer)

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

		if ( ((1 - 2 * Number(isNegative)) * answer) == question.answer ) {
			{
				resetSign();

				setAnswerToPlaceholder();
				question = makeQuestion();

				score += Math.max(0, currentTime - Date.now() + questionTimeMs);
				updateScore();

				currentTime = Date.now();

				updateQuestion();
			}
		}
		
		answerElement.textContent = (
			(isNegative && answer != placeholder) ? "-" : (answer == "" ? "\u200B" : ""))
		+ answer;
	};
}

export function updateQuestion() {
	let questionElement = document.querySelector(".question");
	let barElement = document.querySelector(".progress");

	questionElement.animate(
		{color: ["#CCF0", "#CCF"]},125
	)

	barElement.animate(
		{width: ["0%", "100%"]},questionTimeMs
	)

	questionElement.textContent = question.display;
}

export function updateScore() {
	let streakElement = document.querySelector(".streak");

	if (score != 0) {
		streakElement.animate(
			{color: ["#AFA", "#CCF"]},250
		)
	}

	streakElement.textContent = `Score: ${score}`;
}

