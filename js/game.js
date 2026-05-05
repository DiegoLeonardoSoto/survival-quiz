import { timerControler } from "./timer.js";
import { questionManager } from "./questionManager.js";
import { domManager } from "./domManager.js";

const btnPlay = document.getElementById("btn-play");
const timerDomManager = domManager("timer");
const questionDOMManager = domManager("question");

const timer = timerControler(timerDomManager.element, 80000);

timerDomManager.element.innerText = timer.initialFormatedTime;

const { currentQuestion } = await questionManager();

console.log(currentQuestion);
questionDOMManager.changeText(currentQuestion.questionText);

btnPlay.addEventListener("click", () => {
  console.log("play button clicked");
  if (!timer.isRunning) {
    timer.startTimer();
  }
});
