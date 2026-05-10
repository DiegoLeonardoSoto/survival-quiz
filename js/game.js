import { timerControler } from "./timerController.js";
import { questionManager } from "./questionManager.js";
import { domManager } from "./domManager.js";
import { renderGameOver } from "./renderGameOver.js";

const progressTimer = timerControler(0);

const { currentQuestion, validateAnswer, getNewRandomQuestion } =
  await questionManager();

let gameStats = {};
let answersDOMManager = null;
const timer = timerControler(60000);

const setupGame = () => {
  gameStats = {
    correctAnswers: 0,
    totalQuestions: 1,
    streak: 0,
    longestStreak: 0,
    survivalTime: "",
  };

  const timerDomManager = domManager("timer");
  const questionDOMManager = domManager("question");
  answersDOMManager = domManager("answers");

  timer.resetTimer();

  timerDomManager.changeText(timer.getFormatedTime());

  const btnPlay = document.getElementById("btn-play");

  const renderQuestion = () => {
    questionDOMManager.changeText(currentQuestion.questionText);
    currentQuestion.options.forEach((option, i) => {
      answersDOMManager.element.children[i].textContent = option;
    });
  };

  renderQuestion();

  btnPlay.addEventListener("click", () => {
    timer.startTimer(timerDomManager.element);
    progressTimer.startTimer();
    enabledButtons();
  });

  answersDOMManager.element.addEventListener("click", (e) => {
    e.preventDefault();
    let isCorrect = validateAnswer(e.target.textContent);
    currentQuestion.tries -= 1;

    if (isCorrect) {
      gameStats.correctAnswers += 1;
      gameStats.streak += 1;
      gameStats.longestStreak = Math.max(
        gameStats.longestStreak,
        gameStats.streak,
      );
      timer.addTime(5000);
    } else {
      timer.reduceTime(5000);
      e.target.disabled = true;
      gameStats.streak = 0;
      console.log(e.target);
    }

    if (isCorrect || currentQuestion.tries === 0) {
      enabledButtons();
      getNewRandomQuestion();
      gameStats.totalQuestions += 1;
      renderQuestion();
    }
  });
};

setupGame();

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

window.addEventListener("timerStop", (e) => {
  gameStats.survivalTime = progressTimer.getFormatedTime();
  progressTimer.resetTimer();
  disabledButtons();
  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
  console.log("hola mundo");
});
