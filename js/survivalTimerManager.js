import { questionTimer } from "./questionTimer.js";
import { formatTime } from "./utilities.js";

const { stopQuestionTimer, hasExpiredQuestionTimer, nextQuestion } =
  questionTimer;

function createSurvivalTimerManager(timerElement = null) {
  let timerElementRef = timerElement;
  let currentTime = 0;
  let intervalId;
  let isRunning = false;

  function setTimerElement(newTimerElement) {
    timerElementRef = newTimerElement;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;

    intervalId = setInterval(() => {
      reduceTime(10);
      if (timerElementRef)
        timerElementRef.textContent = getFormatedTime(currentTime);
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
    timerElementRef.textContent = getFormatedTime(currentTime);
    timerElementRef.style.cssText = "";
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
    setTimerElement,
  };
}

export const survivalTimerManager = createSurvivalTimerManager(
  document.querySelector("#timer"),
);
