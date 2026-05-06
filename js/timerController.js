export const timerControler = (initTime) => {
  let currentTime = initTime;
  let intervalId;
  let isRunning = false;

  const formatTime = (milisecondsInput) => {
    let min = (~~(milisecondsInput / 60000)).toString();
    let sec = (~~((milisecondsInput % 60000) / 1000)).toString();
    let ms = (~~((milisecondsInput % 1000) / 10)).toString();

    return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}:${ms.padStart(2, "0")}`;
  };

  function startTimer(timerElement = null) {
    isRunning = true;
    intervalId = setInterval(() => {
      initTime === 0 ? addTime(10) : reduceTime(10);
      if (timerElement) timerElement.textContent = getFormatedTime(currentTime);
      if (currentTime === 0) {
        stopTimer();
      }
    }, 10);
  }

  function addTime(time) {
    if (isRunning) {
      currentTime += time;
    }
  }

  function reduceTime(time) {
    if (isRunning) {
      currentTime = Math.max(0, currentTime - time);
    }
  }

  function stopTimer() {
    if (isRunning) {
      window.dispatchEvent(
        new CustomEvent("timerStop", {
          detail: { currentTime },
        }),
      );
      clearInterval(intervalId);
      isRunning = false;
    }
  }

  function getFormatedTime(time = currentTime) {
    return formatTime(time);
  }

  return {
    startTimer,
    isRunning,
    addTime,
    reduceTime,
    stopTimer,
    getFormatedTime,
  };
};
