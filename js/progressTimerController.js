import { formatTime } from "./utilities.js";

export const progressTimerController = () => {
  let currentTime = 0;
  let intervalId;
  let isRunning = false;

  function startTimer() {
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

  function resetTimer() {
    stopTimer();
    currentTime = 0;
  }

  return {
    startTimer,
    resetTimer,
    getFormatedTime,
  };
};
