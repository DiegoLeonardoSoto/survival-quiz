import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
import { refreshManager } from "./refreshManager.js";
import { questionManager } from "./questionManager.js";
import { streakManager } from "./streakManager.js";
import { progressTimerManager } from "./progressTimerManager.js";
import { gameIntroManager } from "./gameIntroManager.js";
import { countDownTimerManager } from "./countDownTimerManager.js";
import { questionTimer } from "./questionTimer.js";

const {
  getTries,
  decrementTries,
  validateAnswer,
  resetQuestions,
  setDOMReferences,
  getDOMReferences,
  setDifficulty,
  getDuration,
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
  getFormatedTime,
  addTime,
  reduceTime,
  startTimer,
  getCurrentTime,
} = countDownTimerManager;
const { startProgressTimer } = progressTimerManager;
const { nextQuestion } = questionTimer;

let timerDomManager = null;
let pulseAnimation = null;
const correctGradientDomManager = document.querySelector("#correctGradient");
const wrongGradientDomManager = document.querySelector("#wrongGradient");

export function cancelPulse() {
  pulseAnimation?.cancel();
  pulseAnimation = null;
}

export function setupGame() {
  timerDomManager = document.querySelector("#timer");

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
  resetTimer(getDuration());
  resetRefreshButton();
  cleanStreak();
  resetIntro();

  timerDomManager.textContent = getFormatedTime();

  answersDOMReference.addEventListener("click", async (e) => {
    if (e.target.tagName !== "BUTTON" || !e.target.id.includes("answer"))
      return;

    let isCorrect = validateAnswer(e.target.textContent);
    decrementTries();

    if (isCorrect) {
      incrementStreak();
      addTime(5000);
      correctGradientDomManager.classList.add("opacity-100");
      setTimeout(() => {
        correctGradientDomManager.classList.remove("opacity-100");
      }, 250);
    } else {
      reduceTime(5000);
      e.target.disabled = true;
      hiddenStreak();
      wrongGradientDomManager.classList.add("opacity-100");
      setTimeout(() => {
        wrongGradientDomManager.classList.remove("opacity-100");
      }, 250);

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
      startTimer(timerDomManager);
      startProgressTimer();
    });
  });
}
