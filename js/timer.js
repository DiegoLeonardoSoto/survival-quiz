export const timerControler = (timerElement, initTime) => {
  let currentTime = initTime;
  let intervalId;
  let isRunning = false;

  const formatTime = (milisecondsInput) => {
    let min = (~~(milisecondsInput / 60000)).toString();
    let sec = (~~((milisecondsInput % 60000) / 1000)).toString();
    let ms = (~~((milisecondsInput % 1000) / 10)).toString();

    return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}:${ms.padStart(2, "0")}`;
  };

  const initialFormatedTime = formatTime(initTime);

  function startTimer() {
    isRunning = true;
    intervalId = setInterval(() => {
      reduceTime(10);
      timerElement.textContent = formatTime(currentTime);
      if (currentTime === 0) {
        clearInterval(intervalId);
        isRunning = false;
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

  return {
    startTimer,
    isRunning,
    addTime,
    reduceTime,
    initialFormatedTime,
  };
};
