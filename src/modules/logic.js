import { makeQuestion, updateQuestion, updateScore } from "./questions.js";

globalThis.question = makeQuestion();
globalThis.score = 0;
globalThis.isNegative = false;
globalThis.answer = "";

globalThis.questionTimeMs = 10000;

let answerElement = document.querySelector(".answer");
let throbber = document.querySelector(".throbber");

let placeholder = "Answer here..."
let isPlaceholder = true;
let currentTime = Date.now();

export function takeInput() {

	updateQuestion();

	document.onkeydown = (e) => {

		let keyCode = e.code;
		let numberKeyPressed= keyCode.startsWith("Digit");

		isPlaceholder = answer == placeholder;

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
}