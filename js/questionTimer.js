import { questionManager } from "./questionManager.js";

const { incrementTotalQuestions, renderQuestion } = await questionManager;

function createQuestionTimer() {
  let questionStartTime = null;
  const DURATION = 10;

  function startQuestionTimer() {
    questionStartTime = performance.now();
  }

  function hasExpiredQuestionTimer() {
    if (questionStartTime === null) return false;
    return performance.now() - questionStartTime > DURATION * 1000;
  }

  function stopQuestionTimer() {
    questionStartTime = null;
  }

  async function nextQuestion(currentTime) {
    await renderQuestion(Math.min(DURATION, currentTime / 1000));
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
