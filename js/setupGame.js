import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
import { questionManager } from "./questionManager.js";
import { streakManager } from "./streakManager.js";
import { progressTimerManager } from "./progressTimerManager.js";
import { refreshManager } from "./refreshManager.js";
import { gameIntroManager } from "./gameIntroManager.js";
import { countDownTimerManager } from "./countDownTimerManager.js";
import { questionTimer } from "./questionTimer.js";

const {
  getTries,
  decrementTries,
  validateAnswer,
  incrementTotalQuestions,
  resetQuestions,
  renderQuestion,
  setDOMReferences,
  getDOMReferences,
} = await questionManager;

const { incrementStreak, hiddenStreak, cleanStreak } = streakManager;

const {
  hasUses,
  blockRefreshButton,
  unblockRefreshButton,
  isRefreshButtonBlocked,
  showRefreshButton,
} = refreshManager;

const { resetTimer, getFormatedTime, addTime, reduceTime, startTimer } =
  countDownTimerManager(10000);
const { startProgressTimer } = progressTimerManager;
const { nextQuestion, stopTimer } = questionTimer;

let timerDomManager = null;
const correctGradientDomManager = document.querySelector("#correctGradient");
const wrongGradientDomManager = document.querySelector("#wrongGradient");

export function setupGame() {
  timerDomManager = document.querySelector("#timer");

  setDOMReferences(
    document.querySelector("#question"),
    document.querySelector("#answers"),
    document.querySelector("#bar-progress-question"),
  );

  const { questionDOMManager, answersDOMManager } = getDOMReferences();

  questionDOMManager.textContent =
    " Respondé. Sobreviví. No falles. Estas listo?...";

  animate(
    questionDOMManager,
    {
      color: ["#ffffff", "var(--color-muted)", "#ffffff"],
    },
    { duration: 2, repeat: Infinity },
  );

  let { playIntro, setBtnPlayEvent, resetIntro } = gameIntroManager(
    document.querySelector("#btn-play"),
  );

  resetTimer();
  resetQuestions();
  cleanStreak();
  resetIntro();

  timerDomManager.textContent = getFormatedTime();

  answersDOMManager.addEventListener("click", async (e) => {
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

      if (!isRefreshButtonBlocked() && hasUses()) {
        blockRefreshButton();
      }
    }

    if (isCorrect || getTries() === 0) {
      incrementTotalQuestions();
      await nextQuestion();

      if (isRefreshButtonBlocked() && hasUses()) {
        unblockRefreshButton();
      }
    }
  });

  setBtnPlayEvent(() => {
    playIntro().then(async () => {
      await nextQuestion();
      showRefreshButton();
      startTimer(timerDomManager);
      startProgressTimer();
    });
  });
}
