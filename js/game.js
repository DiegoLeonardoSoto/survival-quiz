import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerManager } from "./progressTimerManager.js";
import { streakManager } from "./streakManager.js";
import { refreshManager } from "./refreshManager.js";
import { setupGame } from "./setupGame.js";
import { questionTimer } from "./questionTimer.js";

const { getTotalCorrectAnswers, getTotalQuestions } = await questionManager;

const { getLongestStreak } = streakManager;

const { hasUses, decrementUses, resetRefreshButton, setRefreshEvent } =
  refreshManager;

const { getFormatedTime, resetProgressTimer } = progressTimerManager;
const { nextQuestion, stopQuestionTimer } = questionTimer;

setupGame();

setRefreshEvent(async () => {
  if (hasUses()) {
    await nextQuestion();
  }

  decrementUses();
});

window.addEventListener("timerStop", (e) => {
  stopQuestionTimer();

  const gameStats = {
    correctAnswers: getTotalCorrectAnswers(),
    totalQuestions: getTotalQuestions(),
    longestStreak: getLongestStreak(),
    survivalTime: getFormatedTime(),
  };

  resetProgressTimer();
  resetRefreshButton();

  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
});
