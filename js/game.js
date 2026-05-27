import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerManager } from "./progressTimerManager.js";
import { streakManager } from "./streakManager.js";
import { refreshManager } from "./refreshManager.js";
import { setupGame } from "./setupGame.js";

const { getTotalCorrectAnswers, getTotalQuestions, renderQuestion } =
  await questionManager;

const { getLongestStreak } = streakManager;

const { hasUses, decrementUses, resetRefreshButton, setRefreshEvent } =
  refreshManager;

const { getFormatedTime, resetProgressTimer } = progressTimerManager;

const {
  answersDOMManager: answersDOMManagerSetup,
  questionDOMManager: questionDOMManagerSetup,
} = setupGame();

let answersDOMManager = answersDOMManagerSetup;
let questionDOMManager = questionDOMManagerSetup;

setRefreshEvent(async () => {
  if (hasUses()) {
    await renderQuestion(questionDOMManager, answersDOMManager);
  }

  decrementUses();
});

const disabledButtons = () => {
  answersDOMManager.querySelectorAll("button").forEach((btn) => {
    btn.classList.add("hidden");
    btn.disabled = true;
  });
};

window.addEventListener("timerStop", (e) => {
  const gameStats = {
    correctAnswers: getTotalCorrectAnswers(),
    totalQuestions: getTotalQuestions(),
    longestStreak: getLongestStreak(),
    survivalTime: getFormatedTime(),
  };

  resetProgressTimer();
  resetRefreshButton();
  disabledButtons();

  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  const {
    answersDOMManager: answersDOMManagerSetup,
    questionDOMManager: questionDOMManagerSetup,
  } = setupGame();

  answersDOMManager = answersDOMManagerSetup;
  questionDOMManager = questionDOMManagerSetup;
});
