import { questionManager } from "./questionManager.js";

const {
  incrementTotalQuestions,
  renderQuestion,
  getDuration,
  getTotalQuestions,
} = await questionManager;

function createQuestionTimer() {
  let questionStartTime = null;
  let timerDuration = getDuration();

  function startQuestionTimer() {
    questionStartTime = performance.now();
  }

  function hasExpiredQuestionTimer() {
    if (questionStartTime === null) return false;
    return performance.now() - questionStartTime > timerDuration * 1000;
  }

  function stopQuestionTimer() {
    questionStartTime = null;
  }

  async function nextQuestion(currentTime) {
    timerDuration = getDuration();
    console.log(timerDuration, getTotalQuestions());
    const duration = Math.min(timerDuration, currentTime / 1000);
    await renderQuestion(duration);
    incrementTotalQuestions();
    startQuestionTimer();
  }

  return {
    hasExpiredQuestionTimer,
    stopQuestionTimer,
    nextQuestion,
  };
}

export const questionTimer = createQuestionTimer();
