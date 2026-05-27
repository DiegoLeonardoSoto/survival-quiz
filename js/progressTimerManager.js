import { formatTime } from "./utilities.js";

function createProgressTimerManager() {
  let currentTime = 0;
  let intervalId;
  let isRunning = false;

  function startProgressTimer() {
    isRunning = true;
    intervalId = setInterval(() => {
      currentTime += 10;
    }, 10);
  }

  function stopTimer() {
    if (isRunning) {
      clearInterval(intervalId);
      isRunning = false;
    }
  }

  function getFormatedTime(time = currentTime) {
    return formatTime(time);
  }

  function resetProgressTimer() {
    stopTimer();
    currentTime = 0;
  }

  return {
    startProgressTimer,
    resetProgressTimer,
    getFormatedTime,
  };
}

export const progressTimerManager = createProgressTimerManager();
