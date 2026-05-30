import { questionManager } from "./questionManager.js";
import { renderGameOver } from "./renderGameOver.js";
import { progressTimerManager } from "./progressTimerManager.js";
import { streakManager } from "./streakManager.js";
import { refreshManager } from "./refreshManager.js";
import { setupGame, cancelPulse } from "./setupGame.js";

const { getTotalCorrectAnswers, getTotalQuestions } = await questionManager;

const { getLongestStreak, hiddenStreak } = streakManager;

const { resetRefreshButton } = refreshManager;

const { getFormatedTime, resetProgressTimer } = progressTimerManager;

setupGame();

window.addEventListener("timerStop", (e) => {
  const gameStats = {
    correctAnswers: getTotalCorrectAnswers(),
    totalQuestions: getTotalQuestions(),
    longestStreak: getLongestStreak(),
    survivalTime: getFormatedTime(),
  };

  cancelPulse();
  hiddenStreak();
  resetProgressTimer();
  resetRefreshButton();
  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
});
