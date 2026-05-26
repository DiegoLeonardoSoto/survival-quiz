import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerController } from "./progressTimerController.js";
import { countDownTimerController } from "./countDownTimerController.js";
import { streakManager } from "./streakManager.js";
import { refreshManager } from "./refreshManager.js";

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
let btnRefresh = null;

const {
  incrementStreak,
  getLongestStreak,
  setElement,
  showStreak,
  hiddenStreak,
  cleanStreak,
} = streakManager();

const {
  hasUses,
  setRefreshElement,
  decrementUses,
  blockRefreshButton,
  unblockRefreshButton,
  isRefreshButtonBlocked,
  resetRefreshButton,
} = refreshManager();

let btnPlay = document.querySelector("#btn-play");
const timer = countDownTimerController(60000);
const progressTimer = progressTimerController();

const renderQuestion = () => {
  questionDOMManager.textContent = getQuestionText();
  getQuestionOptions().forEach((option, i) => {
    answersDOMManager.children[i].textContent = option;
  });
};

let isNewGame = false;

const setupGame = () => {
  isNewGame = true;

  timerDomManager = document.querySelector("#timer");
  streakDomManager = document.querySelector("#streak");
  questionDOMManager = document.querySelector("#question");
  correctGradientDomManager = document.querySelector("#correctGradient");
  wrongGradientDomManager = document.querySelector("#wrongGradient");
  answersDOMManager = document.querySelector("#answers");
  btnRefresh = document.querySelector("#btn-refresh");

  timer.resetTimer();
  resetQuestions();

  setElement(streakDomManager);
  setRefreshElement(btnRefresh);
  btnRefresh.classList.toggle("hidden", isNewGame);
  btnPlay.classList.toggle("hidden", !isNewGame);
  cleanStreak();

  timerDomManager.textContent = timer.getFormatedTime();

  answersDOMManager.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    let isCorrect = validateAnswer(e.target.textContent);
    decrementTries();

    if (isCorrect) {
      incrementStreak();
      timer.addTime(5000);
      correctGradientDomManager.classList.add("opacity-100");
      setTimeout(() => {
        correctGradientDomManager.classList.remove("opacity-100");
      }, 250);
    } else {
      timer.reduceTime(5000);
      e.target.disabled = true;
      hiddenStreak();
      wrongGradientDomManager.classList.add("opacity-100");
      setTimeout(() => {
        wrongGradientDomManager.classList.remove("opacity-100");
      }, 250);

      if (!isRefreshButtonBlocked() && hasUses()) {
        blockRefreshButton();
      }
    }

    if (isCorrect || getTries() === 0) {
      incrementTotalQuestions();
      enabledButtons();
      loadQuestion();
      renderQuestion();

      console.log(isRefreshButtonBlocked(), hasUses());

      if (isRefreshButtonBlocked() && hasUses()) {
        unblockRefreshButton();
      }
    }
  });
};

setupGame();

btnPlay.addEventListener("click", () => {
  isNewGame = false;

  btnPlay.classList.toggle("hidden", !isNewGame);
  btnRefresh.classList.toggle("hidden", isNewGame);

  loadQuestion();
  renderQuestion();
  timer.startTimer(timerDomManager);
  showStreak();
  progressTimer.startTimer();
  enabledButtons();
});

btnRefresh.addEventListener("click", () => {
  console.log(hasUses());
  if (hasUses()) {
    loadQuestion();
    renderQuestion();
  }

  decrementUses();
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
  isNewGame = true;

  const gameStats = {
    correctAnswers: getTotalCorrectAnswers(),
    totalQuestions: getTotalQuestions(),
    longestStreak: getLongestStreak(),
    survivalTime: progressTimer.getFormatedTime(),
  };

  progressTimer.resetTimer();
  resetRefreshButton();
  disabledButtons();
  btnPlay.classList.toggle("hidden", isNewGame);
  btnRefresh.classList.toggle("hidden", isNewGame);

  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
});
