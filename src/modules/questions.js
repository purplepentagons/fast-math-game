globalThis.questionTypes = [ 0 ];

globalThis.questionDifficulty = 0;

export function makeQuestion() {
	let questionFunctions = [
		multiplicationQuestion,
		additionQuestion,
		subtractionQuestion
	];

	let chosenQuestionTypes = [];
	
	for (let type of questionTypes) {
		chosenQuestionTypes = chosenQuestionTypes.concat(questionFunctions[type]);
	}

	let chosenFunction = chosenQuestionTypes[
		Math.floor(Math.random()*chosenQuestionTypes.length)
	];

	return chosenFunction(questionDifficulty)
}	

function randomRoundNumber(magnitude) {
	return Math.round(Math.random()*Math.pow(10, magnitude));
}

function randomSign() {
	return 1 - 2*Math.floor(Math.random()*2)
}

function multiplicationQuestion(difficulty) {
	let number1 = randomRoundNumber(difficulty+1)*randomSign();
	let number2 = randomRoundNumber(difficulty+1)*randomSign();

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