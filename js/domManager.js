export const domManager = (id) => {
  const element = document.querySelector(`#${id}`);

  const addClasses = (classes) => {
    element.classList.add(...classes);
  };

  const removeClasses = (classes) => {
    element.classList.remove(...classes);
  };

  const toggleClass = (classes) => {
    element.classList.toggle(classes);
  };

  const changeText = (text) => {
    element.textContent = text;
  };

  return {
    element,
    addClasses,
    removeClasses,
    toggleClass,
    changeText,
  };
};
