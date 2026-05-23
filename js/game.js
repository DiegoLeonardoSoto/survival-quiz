import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerController } from "./progressTimerController.js";
import { countDownTimerController } from "./countDownTimerController.js";
import { streakManager } from "./streakManager.js";

const {
  getQuestionText,
  getQuestionOptions,
  getTries,
  getTotalCorrectAnswers,
  getTotalQuestions,
  decrementTries,
  validateAnswer,
  incrementTotalQuestions,
  loadQuestion,
  resetQuestions,
} = await questionManager();

let timerDomManager = null;
let answersDOMManager = null;
let streakDomManager = null;
let correctGradientDomManager = null;
let wrongGradientDomManager = null;
let questionDOMManager = null;

const {
  incrementStreak,
  getLongestStreak,
  setElement,
  showStreak,
  hiddenStreak,
  cleanStreak,
} = streakManager();

let btnPlay = document.querySelector("#btn-play");
const timer = countDownTimerController(60000);
const progressTimer = progressTimerController();

const renderQuestion = () => {
  questionDOMManager.textContent = getQuestionText();
  getQuestionOptions().forEach((option, i) => {
    answersDOMManager.children[i].textContent = option;
  });
};

const setupGame = () => {
  timerDomManager = document.querySelector("#timer");
  streakDomManager = document.querySelector("#streak");
  questionDOMManager = document.querySelector("#question");
  correctGradientDomManager = document.querySelector("#correctGradient");
  wrongGradientDomManager = document.querySelector("#wrongGradient");
  answersDOMManager = document.querySelector("#answers");

  timer.resetTimer();
  resetQuestions();

  setElement(streakDomManager);
  cleanStreak();

  timerDomManager.textContent = timer.getFormatedTime();

  if (btnPlay.classList.contains("hidden")) {
    btnPlay.classList.toggle("hidden");
  }

  answersDOMManager.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    let isCorrect = validateAnswer(e.target.textContent);
    decrementTries();

    if (isCorrect) {
      incrementStreak();
      timer.addTime(5000);
      correctGradientDomManager.classList.toggle("hidden");
      setTimeout(() => {
        correctGradientDomManager.classList.toggle("hidden");
      }, 250);
    } else {
      timer.reduceTime(5000);
      e.target.disabled = true;
      hiddenStreak();
      wrongGradientDomManager.classList.toggle("hidden");
      setTimeout(() => {
        wrongGradientDomManager.classList.toggle("hidden");
      }, 250);
    }

    if (isCorrect || getTries() === 0) {
      incrementTotalQuestions();
      enabledButtons();
      loadQuestion();
      renderQuestion();
    }
  });
};

setupGame();

btnPlay.addEventListener("click", () => {
  loadQuestion();
  renderQuestion();
  timer.startTimer(timerDomManager);
  showStreak();
  progressTimer.startTimer();
  enabledButtons();
});

const enabledButtons = () => {
  answersDOMManager.querySelectorAll("button").forEach((btn) => {
    btn.disabled = false;
  });
};

const disabledButtons = () => {
  answersDOMManager.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
};

window.addEventListener("timerStop", (e) => {
  const gameStats = {
    correctAnswers: getTotalCorrectAnswers(),
    totalQuestions: getTotalQuestions(),
    longestStreak: getLongestStreak(),
    survivalTime: progressTimer.getFormatedTime(),
  };

  progressTimer.resetTimer();
  disabledButtons();
  btnPlay.classList.toggle("hidden");

  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
});
