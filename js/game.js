import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerController } from "./progressTimerController.js";
import { countDownTimerController } from "./countDownTimerController.js";
import { streakManager } from "./streakManager.js";

const {
  getQuestionText,
  getQuestionOptions,
  getTries,
  decrementTries,
  validateAnswer,
  loadQuestion,
} = await questionManager();

let gameStats = {};
let timerDomManager = null;
let answersDOMManager = null;
let streakDomManager = null;
let correctGradientDomManager = null;
let wrongGradientDomManager = null;

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

const setupGame = () => {
  gameStats = {
    correctAnswers: 0,
    totalQuestions: 1,
    streak: 0,
    longestStreak: 0,
    survivalTime: "",
  };

  timerDomManager = document.querySelector("#timer");
  streakDomManager = document.querySelector("#streak");
  const questionDOMManager = document.querySelector("#question");
  correctGradientDomManager = document.querySelector("#correctGradient");
  wrongGradientDomManager = document.querySelector("#wrongGradient");
  answersDOMManager = document.querySelector("#answers");

  timer.resetTimer();

  setElement(streakDomManager);
  cleanStreak();

  timerDomManager.textContent = timer.getFormatedTime();

  if (btnPlay.classList.contains("hidden")) {
    btnPlay.classList.toggle("hidden");
  }

  const renderQuestion = () => {
    questionDOMManager.textContent = getQuestionText();
    getQuestionOptions().forEach((option, i) => {
      answersDOMManager.children[i].textContent = option;
    });
  };

  renderQuestion();

  answersDOMManager.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    let isCorrect = validateAnswer(e.target.textContent);
    decrementTries();

    if (isCorrect) {
      gameStats.correctAnswers += 1;
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
      enabledButtons();
      loadQuestion();
      gameStats.totalQuestions += 1;
      renderQuestion();
    }
  });
};

setupGame();

btnPlay.addEventListener("click", () => {
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
  gameStats.survivalTime = progressTimer.getFormatedTime();
  gameStats.longestStreak = getLongestStreak();
  progressTimer.resetTimer();
  disabledButtons();
  btnPlay.classList.toggle("hidden");

  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
});
