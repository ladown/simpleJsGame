'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const inputTime = document.querySelector('#game-time');
  const timeText = document.querySelector('#time');

  const start = document.querySelector('#start');
  const gameField = document.querySelector('#game');

  const timeHeader = document.querySelector('#time-header');
  const resultHeader = document.querySelector('#result-header');
  const result = document.querySelector('#result');

  let score = 0;
  let isGameStarted = false;

  inputTime.addEventListener('input', setGameTime);

  gameField.addEventListener('click', handleBoxClick);

  function show(el) {
    el.classList.remove('hide');
  }

  function hide(el) {
    el.classList.add('hide');
  }

  function startGame() {
    score = 0;

    setGameTime();

    inputTime.setAttribute('disabled', true);

    isGameStarted = true;

    hide(start);

    gameField.style.backgroundColor = '#fff';

    const interval = setInterval(() => {
      let time = parseFloat(timeText.textContent);

      if (time <= 0) {
        clearInterval(interval);

        endGame();
      } else {
        timeText.textContent = (time - 0.1).toFixed(1);
      }
    }, 100);

    renderBox();
  }

  function setGameScore() {
    result.textContent = score.toString();
  }

  function setGameTime() {
    let time = +inputTime.value;
    timeText.textContent = time.toFixed(1);
    show(timeHeader);
    hide(resultHeader);
  }

  function endGame() {
    inputTime.removeAttribute('disabled');
    isGameStarted = false;
    setGameScore();
    show(start);
    gameField.style.backgroundColor = '#ccc';
    gameField.innerHTML = ``;
    hide(timeHeader);
    show(resultHeader);
  }

  function handleBoxClick(event) {
    if (!isGameStarted) {
      return;
    }
    if (event.target.dataset.box) {
      score++;
      renderBox();
    }
  }

  start.addEventListener('click', startGame);

  function renderBox() {
    gameField.innerHTML = '';

    const box = document.createElement('div');

    let boxSize = getRandom(30, 100);

    let gameSize = gameField.getBoundingClientRect();

    let maxTop = gameSize.height - boxSize;
    let maxLeft = gameSize.width - boxSize;

    box.style.height = box.style.width = `${boxSize}px`;
    box.style.position = 'absolute';
    box.style.background = `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
    box.style.top = `${getRandom(0, maxTop)}px`;
    box.style.left = `${getRandom(0, maxLeft)}px`;
    box.style.cursor = 'pointer';

    box.setAttribute('data-box', 'true');

    gameField.insertAdjacentElement('afterbegin', box);
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function getRandomColor() {
    return Math.floor(255 - Math.random() * 100);
  }
});
