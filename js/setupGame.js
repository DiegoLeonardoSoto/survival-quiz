import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
import { refreshManager } from "./refreshManager.js";
import { questionManager } from "./questionManager.js";
import { streakManager } from "./streakManager.js";
import { progressTimerManager } from "./progressTimerManager.js";
import { gameIntroManager } from "./gameIntroManager.js";
import { survivalTimerManager } from "./survivalTimerManager.js";
import { questionTimer } from "./questionTimer.js";

const {
  getTries,
  decrementTries,
  validateAnswer,
  resetQuestions,
  setDOMReferences,
  getDOMReferences,
  setDifficulty,
  getDificultyDuration,
  answerBlockAnimation,
} = await questionManager;

const { incrementStreak, hiddenStreak, cleanStreak } = streakManager;

const {
  hasUses,
  blockRefreshButton,
  unblockRefreshButton,
  showRefreshButton,
  resetRefreshButton,
} = refreshManager;

const {
  resetTimer,
  addTime,
  reduceTime,
  startTimer,
  getCurrentTime,
  setTimerElement,
} = survivalTimerManager;
const { startProgressTimer } = progressTimerManager;
const { nextQuestion } = questionTimer;

let pulseAnimation = null;
const correctGradientDomManager = document.querySelector("#correctGradient");
const wrongGradientDomManager = document.querySelector("#wrongGradient");

function gameAnimation() {
  function correctAnswerAnimation() {
    return animate(
      "#timer",
      {
        scale: [1, 1.3, 1],
        color: [
          "var(--color-secondary)",
          "var(--color-accent)",
          "var(--color-secondary)",
        ],
      },
      { duration: 0.5 },
    );
  }

  function wrongAnswerAnimation() {
    return animate(
      "#timer",
      {
        x: [0, -12, 12, -8, 8, -4, 4, 0],
        color: [
          "var(--color-secondary)",
          "var(--color-wrong)",
          "var(--color-secondary)",
        ],
      },
      { duration: 1 },
    );
  }
  function wrongGradientAnimation() {
    return animate(
      wrongGradientDomManager,
      {
        opacity: [0, 1, 0],
      },
      { duration: 0.7, fill: "forwards" },
    );
  }

  function correctGradientAnimation() {
    return animate(
      correctGradientDomManager,
      {
        opacity: [0, 1, 0],
      },
      { duration: 0.7, fill: "forwards" },
    );
  }

  return {
    correctAnswerAnimation,
    wrongAnswerAnimation,
    correctGradientAnimation,
    wrongGradientAnimation,
  };
}

export function cancelPulse() {
  pulseAnimation?.cancel();
  pulseAnimation = null;
}

const {
  correctAnswerAnimation,
  wrongAnswerAnimation,
  correctGradientAnimation,
  wrongGradientAnimation,
} = gameAnimation();

const arrayDifficulty = {
  easy: { correct: 5000, wrong: 2000 },
  medium: { correct: 4000, wrong: 4000 },
  hard: { correct: 2000, wrong: 5000 },
};

export function setupGame() {
  setTimerElement(document.querySelector("#timer"));

  setDOMReferences(
    document.querySelector("#question"),
    document.querySelector("#answers"),
    document.querySelector("#bar-progress-question"),
  );

  const { questionDOMReference, answersDOMReference } = getDOMReferences();

  questionDOMReference.textContent =
    " Respondé. Sobreviví. No falles. Estas listo?...";

  cancelPulse();
  pulseAnimation = animate(
    questionDOMReference,
    {
      color: ["#ffffff", "var(--color-muted)", "#ffffff"],
    },
    { duration: 2, repeat: Infinity },
  );

  let { playIntro, setBtnPlayEvent, resetIntro } = gameIntroManager(
    document.querySelector("#btn-play"),
  );

  const params = new URLSearchParams(window.location.search);
  const difficulty = params.get("difficulty") || "easy";

  setDifficulty(difficulty);
  resetQuestions();
  resetTimer(getDificultyDuration());
  resetRefreshButton();
  cleanStreak();
  resetIntro();

  answersDOMReference.addEventListener("click", async (e) => {
    if (e.target.tagName !== "BUTTON" || !e.target.id.includes("answer"))
      return;

    let isCorrect = validateAnswer(e.target.textContent);
    decrementTries();

    if (isCorrect) {
      incrementStreak();
      addTime(arrayDifficulty[difficulty].correct);
      correctGradientAnimation();
      correctAnswerAnimation();
    } else {
      reduceTime(arrayDifficulty[difficulty].wrong);
      e.target.disabled = true;
      e.target.setAttribute("aria-disabled", "true");
      answerBlockAnimation(e.target);
      hiddenStreak();
      wrongGradientAnimation();
      wrongAnswerAnimation();

      if (hasUses()) {
        blockRefreshButton();
      }
    }

    if (isCorrect || getTries() === 0) {
      await nextQuestion(getCurrentTime());
      if (hasUses()) {
        unblockRefreshButton();
      }
    }
  });

  setBtnPlayEvent(() => {
    playIntro().then(async () => {
      showRefreshButton();
      await nextQuestion(getCurrentTime());
      startTimer();
      startProgressTimer();
    });
  });
}
