import { updateQuestion, updateScore } from "./input.js";

let questionTypes = [ 0 ];

let questionDifficulty = [ 0 ];

export function addButtonListeners() {
	let difficulties = document.querySelectorAll(".difficulty");
	let types = document.querySelectorAll(".mode");

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
			
			globalThis.score = 0;
			updateScore(score);

			globalThis.question = makeQuestion();
			updateQuestion(globalThis.question);
		}
	};

	for (let difficulty of difficulties) {
		difficulty.onclick = () => {
			for (let e of difficulties) {
				e.classList.add("gray")
			}
			difficulty.classList.remove("gray")

			questionDifficulty = Number(difficulty.getAttribute("data-mode"))

			globalThis.score = 0;
			updateScore(score);

			globalThis.question = makeQuestion();
			updateQuestion(globalThis.question);
		}
	};
}

export function makeQuestion() {
	let questionFunctions = [
		multiplicationQuestion,
		additionQuestion,
		subtractionQuestion
	];

	let chosenFunctions = [];
	
	for (let type of questionTypes) {
		chosenFunctions = chosenFunctions.concat(questionFunctions[type]);
	}

	let chosenFunction = chosenFunctions[
		Math.floor(Math.random()*chosenFunctions.length)
	];

	return chosenFunction(questionDifficulty)
}	

function randomRoundNumber(magnitude) {
	return Math.round(Math.random()*Math.pow(10, magnitude));
}

function multiplicationQuestion(difficulty) {
	let number1 = Math.pow(10, difficulty+1) - 2*randomRoundNumber(difficulty+1);
	let number2 = Math.pow(10, difficulty+1) - 2*randomRoundNumber(difficulty+1);

	return {
		display: `${number1} * ${number2}`,
		answer: number1 * number2
	}
}

function additionQuestion(difficulty) {
	let number1 = randomRoundNumber(2 * difficulty + 2);
	let number2 = randomRoundNumber(2 * difficulty + 2);

	return {
		display: `${number1} + ${number2}`,
		answer: number1 + number2
	}
}

function subtractionQuestion(difficulty) {
	let number1 = randomRoundNumber(2 * difficulty + 2);
	let number2 = randomRoundNumber(2 * difficulty + 2);

	return {
		display: `${number1} - ${number2}`,
		answer: number1 - number2
	}
}