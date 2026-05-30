import {
  animate,
  stagger,
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

function createDificultyCurve(getDificulty, getTotalQuestions) {
  const DURATIONS = [7, 5, 3];
  const DURATIONS_INDEX = { easy: 0, medium: 1, hard: 2 };

  function getDuration() {
    const currIndex = DURATIONS_INDEX[getDificulty()] ?? 0;
    const total = getTotalQuestions();
    const progression = total < 10 ? 0 : total < 20 ? 1 : 2;
    const index = Math.min(currIndex + progression, DURATIONS.length - 1);

    return DURATIONS[index];
  }

  return {
    getDuration,
  };
}

function questionAnimations() {
  function answersAnimation() {
    return animate(
      ".btn-answer",
      {
        x: ["-5rem", "0"],
        opacity: [0, 1],
      },
      { duration: 0.3, ease: "easeIn", delay: stagger(0.1) },
    );
  }

  function questionAnimation() {
    return animate(
      "#question",
      {
        x: ["-5rem", "0"],
        opacity: [0, 1],
        rotate: [-6, 0],
        scale: [1.5, 1],
      },
      { duration: 0.2, ease: "easeIn" },
    );
  }

  function barAnimation(currBarDuration) {
    return animate(
      "#bar-progress-question",
      { scaleX: [1, 0] },
      { duration: currBarDuration, ease: "linear", fill: "none" },
    );
  }

  return {
    barAnimation,
    questionAnimation,
    answersAnimation,
  };
}

const createQuestionManager = async (
  questionElement,
  answersElement,
  barProgressElement,
) => {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  let difficulty = "easy";
  let currentBarAnimation = null;

  const { getDuration } = createDificultyCurve(
    getDifficulty,
    getTotalQuestions,
  );
  let domReferences = {
    questionDOMReference: questionElement,
    answersDOMReference: answersElement,
    barProgressDOMReference: barProgressElement,
  };

  function setDOMReferences(
    currQuestionDOMReference,
    currAnswersDOMReference,
    currBarProgressDOMReference,
  ) {
    domReferences = {
      questionDOMReference: currQuestionDOMReference,
      answersDOMReference: currAnswersDOMReference,
      barProgressDOMReference: currBarProgressDOMReference,
    };
  }

  const currentQuestion = {
    questionText: "",
    correctAnswer: "",
    tries: 3,
    options: [],
  };

  const { barAnimation, questionAnimation, answersAnimation } =
    questionAnimations();

  async function getQuestions() {
    const response = await fetch("../data/questions.json");
    const data = await response.json();
    return data;
  }

  let questions = await getQuestions();

  const _loadQuestion = async () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions.splice(randomIndex, 1)[0];
    currentQuestion.questionText = question.question;
    currentQuestion.correctAnswer = question.correct_answer;
    currentQuestion.tries = 3;
    currentQuestion.options = shuffle(
      question.correct_answer,
      question.incorrect_answers,
    );

    if (questions.length < 10) {
      questions = await getQuestions();
    }
  };

  const renderQuestion = async (barDuration) => {
    const { questionDOMReference, answersDOMReference } = domReferences;

    await _loadQuestion();

    if (currentBarAnimation) {
      currentBarAnimation.cancel();
      currentBarAnimation = null;
    }

    currentBarAnimation = barAnimation(barDuration);

    currentBarAnimation.play();
    questionAnimation();
    answersAnimation();

    questionDOMReference.textContent = currentQuestion.questionText;
    const options = [...currentQuestion.options];
    const buttonsAnswers = [...answersDOMReference.children].filter((e) =>
      e.id.includes("answer"),
    );

    buttonsAnswers.forEach((button, i) => {
      button.textContent = options[i];
      button.classList.remove("hidden");
      button.disabled = false;
    });
  };

  function incrementTotalQuestions() {
    totalQuestions += 1;
  }

  function shuffle(correctAnswer, incorrectAnswers) {
    let options = [...incorrectAnswers];
    const randomIndex = Math.floor(Math.random() * (options.length + 1));
    options.splice(randomIndex, 0, correctAnswer);

    return options;
  }

  const decrementTries = () => {
    if (currentQuestion.tries > 0) {
      currentQuestion.tries -= 1;
    }
  };

  const validateAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      totalCorrectAnswers += 1;
    }
    return isCorrect;
  };

  const resetQuestions = () => {
    const {
      answersDOMReference,
      barProgressDOMReference,
      questionDOMReference,
    } = domReferences;

    totalCorrectAnswers = 0;
    totalQuestions = 0;
    answersDOMReference.querySelectorAll("button").forEach((btn) => {
      btn.classList.add("hidden");
      btn.disabled = true;
    });
    barProgressDOMReference.style.transform = "scaleX(1)";
    questionDOMReference.style.cssText = "";
  };

  function getTotalQuestions() {
    return totalQuestions;
  }

  function setDifficulty(currDifficulty) {
    difficulty = currDifficulty;
  }

  function getDifficulty() {
    return difficulty;
  }

  return {
    getQuestionText: () => currentQuestion.questionText,
    getQuestionOptions: () => [...currentQuestion.options],
    getTries: () => currentQuestion.tries,
    getTotalCorrectAnswers: () => totalCorrectAnswers,
    getTotalQuestions,
    incrementTotalQuestions,
    decrementTries,
    validateAnswer,
    resetQuestions,
    renderQuestion,
    setDOMReferences,
    getDOMReferences: () => domReferences,
    getDuration,
    setDifficulty,
  };
};

export const questionManager = createQuestionManager(
  document.querySelector("#question"),
  document.querySelector("#answers"),
  document.querySelector("#bar-progress-question"),
);
