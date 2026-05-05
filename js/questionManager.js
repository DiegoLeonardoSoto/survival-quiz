export const questionManager = async () => {
  const currentQuestion = {
    questionText: "",
    correctAnswer: "",
    tries: 3,
    options: [],
  };

  async function getQuestions() {
    return await fetch("../js/questions.json")
      .then((response) => response.json())
      .then((data) => data);
  }

  let questions = await getQuestions();

  console.log(questions);

  const getNewRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions.splice(randomIndex, 1)[0];
    currentQuestion.questionText = question.question;
    currentQuestion.correctAnswer = question.correct_answer;
    currentQuestion.tries = 3;
    currentQuestion.options = shuffle(
      question.correct_answer,
      question.incorrect_answers,
    );
  };

  getNewRandomQuestion();

  function shuffle(correctAnswer, incorrectAnswers) {
    //TODO: logica del shuffle
    return [correctAnswer, ...incorrectAnswers];
  }

  const validateAnswer = async (answer) => {
    if (questions.length < 10) {
      questions = [...questions, ...(await getQuestions())];
    }

    --currentQuestion.tries;

    let isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect || currentQuestion.tries < 0) {
      getNewRandomQuestion();
    }

    return isCorrect;
  };

  return {
    currentQuestion,
    validateAnswer,
  };
};
