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

let gameStats = JSON.parse(sessionStorage.getItem("gameStats")) || null;

if (gameStats) {
  document.querySelector("main").classList.remove("opacity-0");
  renderGameOver(gameStats);
} else {
  document.querySelector("main").classList.remove("opacity-0");
  setupGame();
}

window.addEventListener("timerStop", (e) => {
  gameStats = {
    correctAnswers: getTotalCorrectAnswers(),
    totalQuestions: getTotalQuestions(),
    longestStreak: getLongestStreak(),
    survivalTime: getFormatedTime(),
  };

  sessionStorage.setItem("gameStats", JSON.stringify(gameStats));

  cancelPulse();
  hiddenStreak();
  resetProgressTimer();
  resetRefreshButton();
  renderGameOver(gameStats);
});

window.addEventListener("retryGame", (e) => {
  setupGame();
});
