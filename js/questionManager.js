export const questionManager = async () => {
  const currentQuestion = {
    questionText: "",
    correctAnswer: "",
    tries: 3,
    options: [],
  };

  async function getQuestions() {
    return await fetch("../data/questions.json")
      .then((response) => response.json())
      .then((data) => data);
  }

  let questions = await getQuestions();

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
    let options = [...incorrectAnswers];
    const randomIndex = Math.floor(Math.random() * (options.length + 1));
    options.splice(randomIndex, 0, correctAnswer);

    return options;
  }

  const validateAnswer = (answer) => {
    return answer === currentQuestion.correctAnswer;
  };

  return {
    currentQuestion,
    validateAnswer,
    getNewRandomQuestion,
  };
};
