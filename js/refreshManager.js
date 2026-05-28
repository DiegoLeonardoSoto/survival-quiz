import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
import { countDownTimerManager } from "./countDownTimerManager.js";
import { questionTimer } from "./questionTimer.js";

const { getCurrentTime } = countDownTimerManager;
const { nextQuestion } = questionTimer;

function refreshAnimations(element, duration) {
  let rotation = 0;
  let currentBackground = "var(--color-muted)";

  function decrementAnimation() {
    rotation -= 360;
    return animate(
      element,
      {
        transform: [
          `rotate(${rotation + 360}deg) scale(2)`,
          `rotate(${rotation}deg) scale(1)`,
        ],
      },
      {
        duration,
        ease: "linear",
      },
    );
  }

  function disabledAnimation(fromShow = false) {
    rotation -= 360;

    const animation = animate(
      element,
      {
        backgroundColor: [currentBackground, "var(--color-muted)"],
        opacity: fromShow ? [0, 1] : 1,
        transform: fromShow
          ? [
              `rotate(${rotation + 360}deg) scale(0.3)`,
              `rotate(${rotation + 180}deg) scale(2)`,
              `rotate(${rotation}deg) scale(.7)`,
            ]
          : [
              `rotate(${rotation + 360}deg) scale(2)`,
              `rotate(${rotation}deg) scale(.7)`,
            ],
      },
      {
        duration,
        ease: "easeOut",
      },
    );

    currentBackground = "var(--color-muted)";
    return animation;
  }

  function enabledAnimation() {
    const animation = animate(
      element,
      {
        backgroundColor: [currentBackground, "var(--color-primary)"],
        transform: ["scale(0.7)", "scale(2)", "scale(1)"],
      },
      {
        duration,
        ease: "easeOut",

        backgroundColor: {
          duration: 0.1,
        },
      },
    );

    currentBackground = "var(--color-primary)";
    return animation;
  }

  function incrementAnimation() {
    return animate(
      element,
      {
        transform: [`scale(1)`, `scale(2)`, `scale(1)`],
      },
      {
        duration,
        ease: "easeOut",
      },
    );
  }

  function resetAnimation() {
    rotation += 360;

    const animation = animate(
      element,
      {
        opacity: [1, 0],
        transform: [
          `rotate(${rotation}deg) scale(0.7)`,
          `rotate(${rotation - 180}deg) scale(2)`,
          `rotate(${rotation - 360}deg) scale(.3)`,
        ],
      },
      {
        duration,
        ease: "easeOut",
      },
    );

    currentBackground = "var(--color-muted)";
    return animation;
  }

  function blockedAnimation() {
    const animation = animate(
      element,
      {
        backgroundColor: [currentBackground, "var(--color-wrong)"],
        transform: [
          "translateX(0)",
          "translateX(-12px)",
          "translateX(12px)",
          "translateX(-8px)",
          "translateX(8px)",
          "translateX(-4px)",
          "translateX(4px)",
          "translateX(0)",
        ],
      },
      {
        duration,
        backgroundColor: {
          duration: 0.1,
        },
        ease: "easeOut",
      },
    );

    currentBackground = "var(--color-wrong)";
    return animation;
  }

  return {
    decrementAnimation,
    disabledAnimation,
    enabledAnimation,
    incrementAnimation,
    resetAnimation,
    blockedAnimation,
    reset() {
      rotation = 0;
      currentBackground = "var(--color-muted)";
    },
  };
}

function createRefreshManager(refreshElement) {
  let uses = 0;
  let checkArray = [];
  let usesSpanElement = refreshElement.querySelector("span");
  let isBlocked = false;
  let isAnimating = false;

  // Motion handles all button visuals (backgroundColor, transform, opacity).
  // The badge (<span>) uses CSS transition for text-shadow only.
  // Both systems share the same duration — read from the badge's
  // transition-duration so changing one value cascades everywhere.
  const ANIMATION_DURATION = parseFloat(
    getComputedStyle(usesSpanElement).transitionDuration,
  );

  const {
    decrementAnimation,
    disabledAnimation,
    enabledAnimation,
    incrementAnimation,
    resetAnimation,
    blockedAnimation,
    reset: resetAnimations,
  } = refreshAnimations(refreshElement, ANIMATION_DURATION);

  refreshElement.addEventListener("click", async () => {
    if (hasUses()) {
      _decrementUses();
      await nextQuestion(getCurrentTime());
    }
  });

  window.addEventListener("refreshButtonEvent", (event) => {
    const { streak } = event.detail;
    if (streak <= 0 || checkArray.includes(streak)) return;

    if (streak % 2 === 0) {
      checkArray.push(streak);
      _incrementUses();
    }
  });

  function _decrementUses() {
    if (!hasUses() || isAnimating) return;

    isAnimating = true;
    refreshElement.disabled = true;
    --uses;

    decrementAnimation().then(() => {
      isAnimating = false;
      _updateBadge();
      if (hasUses()) refreshElement.disabled = false;
    });

    if (!hasUses()) {
      _disabledRefreshButton();
    }
  }

  function _incrementUses() {
    if (isBlocked) return;
    ++uses;

    if (uses === 1) {
      _enableRefreshButton();
    } else if (uses > 1) {
      incrementAnimation().play();
      _updateBadge();
    }
  }

  function _updateBadge() {
    if (uses === 0) {
      usesSpanElement.classList.add("hidden");
    } else {
      usesSpanElement.textContent = uses;
      usesSpanElement.classList.remove("hidden");

      if (isBlocked) {
        usesSpanElement.classList.add("text-solid-shadow--wrong");
      } else {
        usesSpanElement.classList.remove("text-solid-shadow--wrong");
      }
    }
  }

  function _disabledRefreshButton(fromShow = false) {
    refreshElement.disabled = true;

    _updateBadge();
    disabledAnimation(fromShow).play();
  }

  function _enableRefreshButton() {
    refreshElement.disabled = false;
    _updateBadge();
    enabledAnimation().play();
  }

  function hasUses() {
    return uses > 0;
  }

  function blockRefreshButton() {
    if (isBlocked) return;

    isBlocked = true;
    refreshElement.disabled = true;
    refreshElement.classList.remove("cursor-pointer");
    _updateBadge();
    blockedAnimation().play();
  }

  function unblockRefreshButton() {
    if (!isBlocked) return;

    isBlocked = false;
    refreshElement.disabled = false;
    refreshElement.classList.add("cursor-pointer");
    _updateBadge();
    enabledAnimation().play();
  }

  function resetRefreshButton() {
    uses = 0;
    checkArray = [];
    resetAnimations();
    _updateBadge();
    isBlocked = false;
    resetAnimation().play();
    refreshElement.classList.add("hidden");
  }

  function showRefreshButton() {
    refreshElement.classList.remove("hidden");
    _disabledRefreshButton(true);
  }

  return {
    resetRefreshButton,
    showRefreshButton,
    hasUses,
    blockRefreshButton,
    unblockRefreshButton,
  };
}

export const refreshManager = createRefreshManager(
  document.querySelector("#btn-refresh"),
);
