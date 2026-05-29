import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

function streakAnimations(element) {
  function hiddeAnimation() {
    return animate(
      element,
      { y: ["-2.5rem", "-3.5rem", "2.5rem"] },
      { duration: 0.2 },
    );
  }

  function showAnimation() {
    return animate(
      element,
      { opacity: [0, 1], y: ["5rem", "0rem"] },
      { duration: 0.2, type: "spring" },
    );
  }

  function updateAnimation() {
    return animate(
      element,
      {
        y: ["0", "-2rem", "0"],
      },
      { duration: 0.2, type: "spring" },
    );
  }

  function timerAnimation() {
    return animate(
      element,
      {
        x: ["1rem", "-1rem", "1rem"],
      },
      {
        repeat: Infinity,
        duration: 2,
        repeatType: "reverse",
        easing: "linear",
        delay: 0.3,
      },
    );
  }

  return {
    hiddeAnimation,
    showAnimation,
    updateAnimation,
    timerAnimation,
  };
}

function streakTimer(onExpire, timerAnimation) {
  let intervalId = null;
  let elapsedTime = 0;
  let timerAnimationController = null;

  function _timerTickLoop() {
    if (!timerAnimationController || intervalId) return;

    intervalId = setInterval(() => {
      if (elapsedTime > 1000 && elapsedTime <= 3000) {
        timerAnimationController.speed *= 2;
      } else if (elapsedTime > 3000) {
        timerAnimationController.speed *= 2;
      }

      if (elapsedTime >= 5000) {
        cancelTimer();
        onExpire();
      }

      elapsedTime += 1000;
    }, 1000);
  }

  function cancelTimer() {
    if (!timerAnimationController || !intervalId) return;

    clearInterval(intervalId);
    timerAnimationController.stop();
    timerAnimationController = null;
    intervalId = null;
    elapsedTime = 0;
  }

  function startTimer() {
    if (intervalId) {
      cancelTimer();
    }

    timerAnimationController = timerAnimation();
    timerAnimationController.play();
    _timerTickLoop();
  }

  return {
    cancelTimer,
    startTimer,
  };
}

function createStreakManager(element) {
  let streak = 0;
  let longestStreak = 0;
  let isHiding = false;

  const { hiddeAnimation, showAnimation, updateAnimation, timerAnimation } =
    streakAnimations(element);

  const hiddenAnimationController = hiddeAnimation();

  const { startTimer, cancelTimer } = streakTimer(hiddenStreak, timerAnimation);

  function _getStreakText() {
    return `x${streak}`;
  }

  function _updateLongestStreak(currStreak) {
    longestStreak = Math.max(longestStreak, currStreak);
  }

  function _showStreak() {
    if (element === null) return;

    hiddenAnimationController.cancel();
    isHiding = false;

    element.classList.remove("hidden");
    showAnimation().play();
  }

  function incrementStreak() {
    if (streak < 0) return;
    streak++;

    window.dispatchEvent(
      new CustomEvent("refreshButtonEvent", {
        detail: {
          streak,
        },
      }),
    );

    if (streak === 1) {
      _showStreak();
      element.textContent = _getStreakText();
    } else {
      element.textContent = _getStreakText();
      updateAnimation().play();
    }
    _updateLongestStreak(streak);
    startTimer();
  }

  function hiddenStreak() {
    if (isHiding) return;

    cancelTimer();
    isHiding = true;
    hiddenAnimationController.play();
    hiddenAnimationController.then(() => {
      element.classList.add("hidden");
      streak = 0;
      isHiding = false;
    });
  }

  function cleanStreak() {
    longestStreak = 0;
    hiddenStreak();
  }

  return {
    getLongestStreak: () => longestStreak,
    incrementStreak,
    cleanStreak,
    hiddenStreak,
  };
}
export const streakManager = createStreakManager(
  document.getElementById("streak"),
);
