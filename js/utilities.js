export const formatTime = (milisecondsInput) => {
  let min = (~~(milisecondsInput / 60000)).toString();
  let sec = (~~((milisecondsInput % 60000) / 1000)).toString();
  let ms = (~~((milisecondsInput % 1000) / 10)).toString();

  return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}:${ms.padStart(2, "0")}`;
};
