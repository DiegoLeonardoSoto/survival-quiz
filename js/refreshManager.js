import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

function createRefreshManager(refreshElement) {
  let uses = 0;
  let checkArray = [];
  let usesSpanElement = refreshElement.querySelector("span");
  let isBlocked = false;
  let rotation = 0;

  window.addEventListener("refreshButtonEvent", (event) => {
    const { streak } = event.detail;
    console.log(streak);
    if (streak < 0 || checkArray.includes(streak)) return;

    if (streak % 2 === 0) {
      ++uses;
      checkArray.push(streak);
      if (uses === 1) {
        enableRefreshButton();
        updateBadge();
      } else if (uses > 1) {
        updateBadge();
      }
    }
  });

  function _shake() {
    animate(
      refreshElement,
      {
        x: ["0rem", "2rem", "-2rem", "0rem"],
      },
      {
        duration: 0.2,
      },
    );
  }

  function _rotate() {
    rotation += 360;
    return animate(
      refreshElement,
      { rotate: rotation },
      {
        duration: 0.2,
        easing: "linear",
      },
    );
  }

  function _scale() {
    animate(
      refreshElement,
      {
        scale: [1, 2, 1],
      },
      {
        duration: 0.1,
      },
    );
  }

  let isAnimating = false;
  function decrementUses() {
    if (!hasUses() || isAnimating) return;

    isAnimating = true;
    refreshElement.disabled = true;
    --uses;

    _rotate().then(() => {
      isAnimating = false;
      updateBadge();
      if (hasUses()) refreshElement.disabled = false;
    });

    if (!hasUses()) {
      disabledRefreshButton();
    }
  }

  function hasUses() {
    console.log(uses);
    return uses > 0;
  }

  function enableRefreshButton() {
    _scale();
    refreshElement.disabled = false;
    refreshElement.classList.remove("bg-muted");
    refreshElement.classList.add("cursor-pointer", "bg-primary");
    usesSpanElement.classList.remove("hidden");
  }

  function disabledRefreshButton() {
    refreshElement.disabled = true;
    refreshElement.classList.add("bg-muted");
    refreshElement.classList.remove("cursor-pointer", "bg-primary");
  }

  function updateBadge() {
    usesSpanElement.textContent = uses;

    if (uses === 0) {
      usesSpanElement.classList.add("hidden");
    } else {
      usesSpanElement.classList.remove("hidden");
    }
  }

  function blockRefreshButton() {
    if (isBlocked) return;

    isBlocked = true;
    refreshElement.disabled = true;
    refreshElement.classList.remove("cursor-pointer");
    usesSpanElement.classList.add("text-solid-shadow--wrong");
    refreshElement.classList.add("bg-wrong");
    _shake();
  }

  function unblockRefreshButton() {
    if (!isBlocked) return;

    isBlocked = false;
    refreshElement.disabled = false;
    refreshElement.classList.add("cursor-pointer");
    usesSpanElement.classList.remove("text-solid-shadow--wrong");
    refreshElement.classList.remove("bg-wrong");
  }

  function resetRefreshButton() {
    uses = 0;
    checkArray = [];
    isBlocked = false;
    disabledRefreshButton();
    refreshElement.classList.add("hidden");
  }

  function setRefreshEvent(callback) {
    refreshElement.addEventListener("click", callback);
  }

  function showRefreshButton() {
    refreshElement.classList.remove("hidden");

    _rotate().play();
  }

  return {
    hasUses,
    decrementUses,
    blockRefreshButton,
    unblockRefreshButton,
    isRefreshButtonBlocked: () => isBlocked,
    resetRefreshButton,
    setRefreshEvent,
    showRefreshButton,
  };
}

export const refreshManager = createRefreshManager(
  document.querySelector("#btn-refresh"),
);
