import { updateQuestion, updateScore } from "./input.js";
import { makeQuestion } from "./questions.js";

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
			
			score = 0;
			updateScore(score);

			question = makeQuestion();
			updateQuestion();
		}
	};

	for (let difficulty of difficulties) {
		difficulty.onclick = () => {
			for (let e of difficulties) {
				e.classList.add("gray")
			}
			difficulty.classList.remove("gray")

			questionDifficulty = Number(difficulty.getAttribute("data-mode"))

			score = 0;
			updateScore();

			question = makeQuestion();
			updateQuestion();
		}
	};
}