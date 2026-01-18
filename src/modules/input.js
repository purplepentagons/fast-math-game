import { makeQuestion } from "./questions.js";

globalThis.question = makeQuestion();
globalThis.score = 0;

export function takeInput() {
	
	let answerElement = document.querySelector(".answer");
	let minusElement = document.querySelector(".sign");
	let throbber = document.querySelector(".throbber");
	let answer = ""
	let isNegative = false;


	let currentTime = Date.now();

	updateQuestion(globalThis.question);

	document.onkeydown = (e) => {
		let placeholder = "Answer here..."
		let keyCode = e.code;
		let numberKeyPressed= keyCode.startsWith("Digit");
		let isPlaceholder = answer == placeholder;
		
		function setToPlaceholder() {
			answerElement.classList.add("gray");
			throbber.classList.add("hidden");
			
			answer = placeholder;
			minusElement.classList.add("hidden");

			answerElement.textContent = answer;
		}

		function resetSign() {
			isNegative = false;
			minusElement.classList.add("hidden-sign");
		}

		if (numberKeyPressed) {
			if (isPlaceholder) {
				answer = "";
			}

			let number = keyCode.charAt(5);
			answer = answer.concat(number).slice(0, 50);

			answerElement.classList.remove("gray");
			throbber.classList.remove("hidden");
			minusElement.classList.remove("hidden");
		};

		if (keyCode == "Minus") {
			isNegative = !isNegative;

			minusElement.classList.toggle("hidden-sign");
		}

		if (keyCode == "Backspace" && !isPlaceholder) {
			if (e.ctrlKey) {
				setToPlaceholder();
				resetSign();
			} else {
				answer = answer.slice(0, -1);
			}
		};

		if (answer == "" && !numberKeyPressed) {
			setToPlaceholder();
		}

		answerElement.textContent = answer;

		if (
			((1 - 2 * Number(isNegative)) * answer) == question.answer
		) { 
			resetSign();

			setToPlaceholder();
			question = makeQuestion();

			globalThis.score += Math.max(0, currentTime - Date.now() + 10000);
			updateScore(score);

			currentTime = Date.now();

			updateQuestion(globalThis.question);
		}
	};
}

export function updateQuestion(question) {
	let questionElement = document.querySelector(".question");

	questionElement.animate(
		{color: ["#CCF0", "#CCF"]},250
	)

	questionElement.textContent = question.display;
}

export function updateScore(score) {
	let streakElement = document.querySelector(".streak");

	streakElement.animate(
		{color: ["#AFA", "#CCF"]},250
	)


	streakElement.textContent = `Score: ${globalThis.score}`;
}

