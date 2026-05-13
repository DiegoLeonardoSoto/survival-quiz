export function streakManager() {
  let element = null;
  let streak = 0;
  let longestStreak = 0;

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
      updateStreak();
    }
  }

  function updateStreak() {
    if (element !== null) {
      element.textContent = getStreak();
    }
  }

  function hiddenStreak() {
    if (element === null) return;

    if (!element.classList.contains("hidden")) {
      element.classList.toggle("hidden");
      resetStreak();
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
