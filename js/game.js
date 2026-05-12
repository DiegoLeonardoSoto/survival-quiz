import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerController } from "./progressTimerController.js";
import { countDownTimerController } from "./countDownTimerController.js";

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
      gameStats.streak += 1;
      gameStats.longestStreak = Math.max(
        gameStats.longestStreak,
        gameStats.streak,
      );
      timer.addTime(5000);
      correctGradientDomManager.classList.toggle("hidden");
      setTimeout(() => {
        correctGradientDomManager.classList.toggle("hidden");
      }, 250);
    } else {
      timer.reduceTime(5000);
      e.target.disabled = true;
      gameStats.streak = 0;
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

    streakDomManager.textContent = `x${gameStats.streak}`;
  });
};

setupGame();

btnPlay.addEventListener("click", () => {
  timer.startTimer(timerDomManager);
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
  progressTimer.resetTimer();
  disabledButtons();
  btnPlay.classList.toggle("hidden");
  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
  console.log("hola mundo");
});
