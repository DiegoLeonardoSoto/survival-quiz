//import { animate } from "motion";
import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
export function streakManager() {
  let element = null;
  let streak = 0;
  let longestStreak = 0;

  function streakTimer() {
    let intervalId = null;
    let elapsedTime = 0;
    let oscillationControls = null;
    let isRunning = false;

    function startTimer() {
      if (isRunning) return;

      oscillationControls = animate(
        element,
        { x: [".5rem", "-.5rem"] },
        {
          repeat: Infinity,
          duration: 0.5,
          repeatType: "reverse",
          type: "tween",
          delay: 0.3,
        },
      );

      intervalId = setInterval(() => {
        if (elapsedTime > 1000 && elapsedTime <= 3000) {
          oscillationControls.speed *= 2;
          console.log("speed 1");
        } else if (elapsedTime > 3000) {
          oscillationControls.speed *= 2;
          console.log("speed 2");
        }

        if (elapsedTime >= 5000) {
          cancelTimer();
          hiddenStreak();
        }

        elapsedTime += 1000;
      }, 1000);

      isRunning = true;
    }

    function cancelTimer() {
      if (!isRunning) return;

      clearInterval(intervalId);
      oscillationControls.stop();
      oscillationControls = null;
      elapsedTime = 0;
      isRunning = false;
    }

    function restartTimer() {
      if (!isRunning) startTimer();
      elapsedTime = 0;
      oscillationControls.speed = 1;
    }

    return {
      startTimer,
      cancelTimer,
      restartTimer,
    };
  }

  const { startTimer, cancelTimer, restartTimer } = streakTimer();

  function getStreak() {
    return `x${streak}`;
  }

  function incrementStreak() {
    streak++;

    if (streak > 0) {
      showStreak();
      updateStreak();
    }

    if (streak > longestStreak) {
      updateLongestStreak();
    }
  }

  function resetStreak() {
    streak = 0;
  }

  function showStreak() {
    if (element === null) return;

    if (element.classList.contains("hidden")) {
      element.classList.toggle("hidden");
      animate(element, { opacity: [0, 1] }, { duration: 0.1 });
      animate(element, { y: "-2.5rem" }, { duration: 0.2 }, { type: "spring" });

      updateStreak();
    }
  }

  function updateStreak() {
    if (element !== null) {
      if (getStreak() !== "x0") {
        animate(
          element,
          { y: ["-2.5rem", "-3.5rem", "-2.5rem"] },
          { duration: 0.2 },
          { type: "spring" },
        );
      }
      element.textContent = getStreak();
      restartTimer();
    }
  }

  function hiddenStreak() {
    if (element === null) return;

    if (!element.classList.contains("hidden")) {
      animate(
        element,
        { y: ["-2.5rem", "-3.5rem", "2.5rem"] },
        { duration: 0.2 },
      );

      setTimeout(() => {
        element.classList.toggle("hidden");
      }, 200);

      resetStreak();
      cancelTimer();
    }
  }

  function cleanStreak() {
    hiddenStreak();
    longestStreak = 0;
  }

  function updateLongestStreak() {
    longestStreak = streak;
  }

  function setElement(newElement) {
    element = newElement;
  }

  return {
    getLongestStreak: () => longestStreak,
    incrementStreak,
    cleanStreak,

    setElement,
    showStreak,
    hiddenStreak,
  };
}
