import { questionManager } from "./questionManager.js";
import { questionTimer } from "./questionTimer.js";
import { formatTime } from "./utilities.js";

const { stopQuestionTimer, hasExpiredQuestionTimer, nextQuestion } =
  questionTimer;

function createCountDownTimerManager() {
  let currentTime = 0;
  let intervalId;
  let isRunning = false;

  function startTimer(timerElement = null) {
    if (isRunning) return;
    isRunning = true;

    intervalId = setInterval(() => {
      reduceTime(10);
      if (timerElement) timerElement.textContent = getFormatedTime(currentTime);
      if (currentTime <= 0) {
        stopQuestionTimer();
        stopTimer();
      } else if (hasExpiredQuestionTimer()) {
        if (currentTime > 1000) {
          nextQuestion(getCurrentTime());
        } else {
          stopQuestionTimer();
          stopTimer();
        }
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

  function resetTimer(initDuration) {
    currentTime = initDuration * 1000;
    stopTimer();
  }

  function getCurrentTime() {
    return currentTime;
  }

  return {
    startTimer,
    isRunning,
    addTime,
    reduceTime,
    stopTimer,
    getFormatedTime,
    resetTimer,
    getCurrentTime,
  };
}

export const countDownTimerManager = createCountDownTimerManager();
