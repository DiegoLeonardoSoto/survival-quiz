import { formatTime } from "./utilities.js";
export const countDownTimerController = (initTime) => {
  let currentTime = initTime;
  let intervalId;
  let isRunning = false;

  function startTimer(timerElement = null) {
    if (isRunning) return;

    isRunning = true;
    intervalId = setInterval(() => {
      reduceTime(10);
      if (timerElement) timerElement.textContent = getFormatedTime(currentTime);
      if (currentTime <= 0) {
        stopTimer();
      }
    }, 10);
  }

  function addTime(time) {
    if (isRunning) {
      currentTime += time;
    }
  }

  function reduceTime(time) {
    if (isRunning) {
      currentTime = Math.max(0, currentTime - time);
    }
  }

  function stopTimer() {
    if (isRunning) {
      clearInterval(intervalId);
      isRunning = false;

      window.dispatchEvent(
        new CustomEvent("timerStop", {
          detail: { currentTime },
        }),
      );
    }
  }

  function getFormatedTime(time = currentTime) {
    return formatTime(time);
  }

  function resetTimer() {
    currentTime = initTime;
    stopTimer();
  }

  return {
    startTimer,
    isRunning,
    addTime,
    reduceTime,
    stopTimer,
    getFormatedTime,
    resetTimer,
  };
};
