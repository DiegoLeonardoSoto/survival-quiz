const screenGameDomManager = document.querySelector("#screen-game");

export function renderGameOver(gameStats) {
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
    <svg class="w-16 h-16 text-secondary fill-current my-5">
      <use href="assets/sprites.svg#icon-document"></use>
  </svg>
  <p
      class="px-8 text-secondary text-3xl rounded-lg cursor-pointer flex items-center gap-3"
  >
      Sobreviviste por
  </p>
  <p class="text-5xl font-extrabold mt-3">${gameStats.survivalTime}</p>

  <table class="table-auto w-full text-lg my-5">
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
      class="bg-primary px-8 py-3 text-white text-2xl rounded-lg cursor-pointer flex items-center gap-3 mt-5"
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
}

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

  screenGameDomManager.innerHTML = `                <span
      id="timer"
      class="text-7xl mt-4 mb-6 font-bold text-center"
      >00:00:00</span
  >

  <p
      id="question"
      class="bg-secondary text-2xl text-white flex text-center w-full justify-center py-8 px-8"
  ></p>

  <div id="answers" class="flex flex-col w-full px-8 gap-4 mt-12">
      <button
          disabled
          id="btn-answer-1"
          class="bg-background text-2xl font-bold text-secondary border-4 border-secondary p-4 rounded-full w-full cursor-pointer disabled:border-muted disabled:text-muted"
      >
          476 d.C.
      </button>
      <button
          disabled
          id="btn-answer-2"
          class="bg-background text-2xl font-bold text-secondary border-4 border-secondary p-4 rounded-full w-full cursor-pointer disabled:border-muted disabled:text-muted"
      >
          410 d.C.
      </button>
      <button
          disabled
          id="btn-answer-3"
          class="bg-background text-2xl font-bold text-secondary border-4 border-secondary p-4 rounded-full w-full cursor-pointer disabled:border-muted disabled:text-muted"
      >
          395 d.C.
      </button>
      <button
          disabled
          id="btn-answer-4"
          class="bg-background text-2xl font-bold text-secondary border-4 border-secondary p-4 rounded-full w-full cursor-pointer disabled:border-muted disabled:text-muted"
      >
          509 d.C.
      </button>
  </div>`;

  window.dispatchEvent(new CustomEvent("retryGame"));
}
