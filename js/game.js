import { timerControler } from "./timerController.js";
import { questionManager } from "./questionManager.js";
import { domManager } from "./domManager.js";

const btnPlay = document.getElementById("btn-play");
const timerDomManager = domManager("timer");
const questionDOMManager = domManager("question");
const answersDOMManager = domManager("answers");

const timer = timerControler(10000);
const progressTimer = timerControler(0);

timerDomManager.element.innerText = timer.getFormatedTime();

const { currentQuestion, validateAnswer, getNewRandomQuestion } =
  await questionManager();

const renderQuestion = () => {
  questionDOMManager.changeText(currentQuestion.questionText);
  currentQuestion.options.forEach((option, i) => {
    answersDOMManager.element.children[i].textContent = option;
  });
};

renderQuestion();

const enabledButtons = () => {
  answersDOMManager.element.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
};

const disabledButtons = () => {
  answersDOMManager.element.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
};

btnPlay.addEventListener("click", () => {
  timer.startTimer(timerDomManager.element);
  progressTimer.startTimer();
  enabledButtons();
});

window.addEventListener("timerStop", (e) => {
  console.log(progressTimer.getFormatedTime());
  disabledButtons();
});

answersDOMManager.element.addEventListener("click", (e) => {
  e.preventDefault();

  let isCorrect = validateAnswer(e.target.textContent);
  currentQuestion.tries -= 1;

  if (isCorrect) {
    timer.addTime(5000);
  } else {
    timer.reduceTime(5000);
    e.target.disabled = true;
    console.log(e.target);
  }

  if (isCorrect || currentQuestion.tries === 0) {
    enabledButtons();
    getNewRandomQuestion();
    renderQuestion();
  }
});
