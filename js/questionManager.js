const createQuestionManager = async () => {
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;

  const currentQuestion = {
    questionText: "",
    correctAnswer: "",
    tries: 3,
    options: [],
  };

  async function getQuestions() {
    const response = await fetch("../data/questions.json");
    const data = await response.json();
    return data;
  }

  let questions = await getQuestions();

  const loadQuestion = async () => {
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

  const renderQuestion = async (questionDOMManager, answersDOMManager) => {
    await loadQuestion();
    questionDOMManager.textContent = currentQuestion.questionText;
    const options = [...currentQuestion.options];
    const buttonsAnswers = [...answersDOMManager.children].filter((e) =>
      e.id.includes("answer"),
    );

    buttonsAnswers.forEach((button, i) => {
      button.textContent = options[i];
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
    totalCorrectAnswers = 0;
    totalQuestions = 0;
  };

  return {
    getQuestionText: () => currentQuestion.questionText,
    getQuestionOptions: () => [...currentQuestion.options],
    getTries: () => currentQuestion.tries,
    getTotalCorrectAnswers: () => totalCorrectAnswers,
    getTotalQuestions: () => totalQuestions,
    incrementTotalQuestions,
    decrementTries,
    validateAnswer,
    loadQuestion,
    resetQuestions,
    renderQuestion,
  };
};

export const questionManager = createQuestionManager();
