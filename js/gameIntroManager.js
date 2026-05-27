import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

export function gameIntroManager(btnPlay) {
  function setBtnPlayEvent(callback) {
    console.log("as");
    btnPlay.addEventListener("click", callback);
  }

  async function _scaleOpacityRotateAnimation() {
    return animate(
      btnPlay,
      {
        scale: [1, 3],
        opacity: [0, 1, 1, 0],
        rotate: [-6, 6, -6, 6],
      },
      { duration: 1 },
    );
  }

  function pulseColorAnimation() {
    return animate(
      btnPlay,
      {
        color: [
          "var(--color-secondary)",
          "var(--color-primary)",
          "var(--color-secondary)",
        ],
      },
      {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
        easing: "linear",
      },
    );
  }

  function resetIntro() {
    btnPlay.textContent = "Jugar";
    btnPlay.classList.toggle("hidden", false);
    btnPlay.disabled = false;
    pulseColorAnimation().play();
  }

  async function playIntro() {
    pulseColorAnimation().cancel();
    btnPlay.disabled = true;
    const steps = [3, 2, 1, "YA!"];

    for (const step of steps) {
      btnPlay.textContent = step;
      await _scaleOpacityRotateAnimation();
    }

    btnPlay.classList.toggle("hidden", true);
    btnPlay.style.cssText = "";
  }

  return {
    playIntro,
    setBtnPlayEvent,
    resetIntro,
  };
}
