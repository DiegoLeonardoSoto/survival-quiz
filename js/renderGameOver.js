const screenGameDomManager = document.querySelector("#screen-game");

export function renderGameOver(gameStats) {
  const cloneScreenGame = screenGameDomManager.cloneNode(true);

  document
    .querySelector("main")
    .firstElementChild.classList.remove(
      "mask-linear-from-30%",
      "mask-linear-to-60%",
    );

  document
    .querySelector("main")
    .firstElementChild.classList.add(
      "mask-linear-from-10%",
      "mask-linear-to-25%",
    );

  screenGameDomManager.innerHTML = `
    <svg class="w-14 h-14 md:w-16 md:h-16 text-secondary fill-current my-5">
      <use href="assets/sprites.svg#icon-document"></use>
  </svg>
  <p
      class="px-8 text-secondary text-2xl md:text-3xl rounded-lg cursor-pointer flex items-center gap-3"
  >
      Sobreviviste por
  </p>
  <p class="text-4xl md:text-6xl font-extrabold mt-3">${gameStats.survivalTime}</p>

  <table class="table-auto w-full md:w-lg text-base md:text-lg my-5">
      <tbody>
          <tr class="flex gap-3">
              <td class="flex-2 text-right">
                  Cantidad de preguntas:
              </td>
              <td class="flex-1 text-left">${gameStats.totalQuestions}</td>
          </tr>
          <tr class="flex gap-3 my-3">
              <td class="flex-2 text-right">
                  Respuestas correctas:
              </td>
              <td class="flex-1 text-left">${gameStats.correctAnswers}</td>
          </tr>
          <tr class="flex gap-3">
              <td class="flex-2 text-right">Racha mas larga:</td>
              <td class="flex-1 text-left">${gameStats.longestStreak}</td>
          </tr>
      </tbody>
  </table>

  <button
  id="btn-retry"
      class="bg-primary px-6 md:px-10 py-3 text-white text-xl md:text-2xl rounded-lg cursor-pointer flex items-center gap-3 mt-5"
  >
      REINTENTAR
      <svg class="w-6 h-6 text-white fill-current">
          <use href="../assets/sprites.svg#icon-play"></use>
      </svg>
  </button>`;

  const btnRetry = document.getElementById("btn-retry");
  btnRetry.addEventListener("click", () => {
    renderNewGame();
  });

  function renderNewGame() {
    document
      .querySelector("main")
      .firstElementChild.classList.remove(
        "mask-linear-from-10%",
        "mask-linear-to-25%",
      );
    document
      .querySelector("main")
      .firstElementChild.classList.add(
        "mask-linear-from-30%",
        "mask-linear-to-60%",
      );

    screenGameDomManager.replaceChildren(...cloneScreenGame.childNodes);

    window.dispatchEvent(new CustomEvent("retryGame"));
  }
}
