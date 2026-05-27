import { questionManager } from "./questionManager.js";

const { incrementTotalQuestions, renderQuestion, resetQuestions } =
  await questionManager;

function createQuestionTimer() {
  let idTimeOut = null;
  let firstQuestion = true;
  const duration = 10;

  async function nextQuestion() {
    clearTimeout(idTimeOut);
    await renderQuestion(duration);

    if (firstQuestion) {
      firstQuestion = false;
    } else {
      incrementTotalQuestions();
    }

    idTimeOut = setTimeout(() => {
      nextQuestion();
    }, duration * 1000);
  }

  function stopQuestionTimer() {
    if (idTimeOut !== null) {
      clearTimeout(idTimeOut);
      idTimeOut = null;
    }
    resetQuestions();

    firstQuestion = true;
  }

  return {
    nextQuestion,
    stopQuestionTimer,
  };
}

export const questionTimer = createQuestionTimer();
