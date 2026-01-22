globalThis.game.questionTypes = [ 0 ];
globalThis.game.questionDifficulty = 0;
globalThis.game.questionMode = 0;
globalThis.game.questionModeType = "Free";

game.makeQuestion = function() {
	let questionFunctions = [
		game.multiplicationQuestion,
		game.additionQuestion,
		game.subtractionQuestion
	];

	let chosenQuestionTypes = [];
	
	for (let type of game.questionTypes) {
		chosenQuestionTypes = chosenQuestionTypes.concat(questionFunctions[type]);
	}

	let chosenFunction = chosenQuestionTypes[
		Math.floor(Math.random()*chosenQuestionTypes.length)
	];

	return chosenFunction(game.questionDifficulty)
}	

game.randomRoundNumber = function(magnitude) {
	return Math.round(Math.random()*Math.pow(10, magnitude));
}

game.randomSign = function() {
	return 1 - 2*Math.floor(Math.random()*2)
}

game.multiplicationQuestion = function(difficulty) {
	let number1 = game.randomRoundNumber(difficulty+1)*game.randomSign();
	let number2 = game.randomRoundNumber(difficulty+1)*game.randomSign();

	return {
		display: `${number1} * ${number2}`,
		answer: number1 * number2
	}
}

game.additionQuestion = function(difficulty) {
	let number1 = randomRoundNumber(2 * difficulty + 2);
	let number2 = randomRoundNumber(2 * difficulty + 2);

	return {
		display: `${number1} + ${number2}`,
		answer: number1 + number2
	}
}

game.subtractionQuestion = function(difficulty) {
	let number1 = randomRoundNumber(2 * difficulty + 2);
	let number2 = randomRoundNumber(2 * difficulty + 2);

	return {
		display: `${number1} - ${number2}`,
		answer: number1 - number2
	}
}

game.updateQuestion = function() {
	let questionElement = document.querySelector(".question");

	questionElement.animate(
		{color: ["#CCF0", "#CCF"]},125
	)

	questionElement.textContent = game.question.display;
}