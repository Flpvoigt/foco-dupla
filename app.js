const timerElement = document.querySelector("#timer");
const statusElement = document.querySelector("#status");
const toggleButton = document.querySelector("#toggle");
const resetButton = document.querySelector("#reset");
const sessionsElement = document.querySelector("#sessions");
const presetButtons = document.querySelectorAll(".preset");

let selectedMinutes = 25;
let secondsLeft = selectedMinutes * 60;
let intervalId = null;
let sessions = Number(localStorage.getItem("foco-sessions")) || 0;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function render() {
  const time = formatTime(secondsLeft);
  timerElement.textContent = time;
  timerElement.setAttribute("aria-label", `${time} restantes`);
  sessionsElement.textContent = sessions;
  document.title = `${time} · Foco em Dupla`;
}

function stopTimer(message = "Timer pausado") {
  window.clearInterval(intervalId);
  intervalId = null;
  toggleButton.textContent = "Continuar";
  statusElement.textContent = message;
}

function completeSession() {
  stopTimer("🎉 Sessão concluída!");
  sessions += 1;
  localStorage.setItem("foco-sessions", String(sessions));
  secondsLeft = selectedMinutes * 60;
  toggleButton.textContent = "Iniciar novamente";
  render();
}

function tick() {
  secondsLeft -= 1;
  if (secondsLeft <= 0) {
    completeSession();
    return;
  }
  render();
}

toggleButton.addEventListener("click", () => {
  if (intervalId) {
    stopTimer();
    return;
  }

  intervalId = window.setInterval(tick, 1000);
  toggleButton.textContent = "Pausar";
  statusElement.textContent = selectedMinutes === 25 ? "Hora de focar" : "Respire um pouco";
});

resetButton.addEventListener("click", () => {
  window.clearInterval(intervalId);
  intervalId = null;
  secondsLeft = selectedMinutes * 60;
  toggleButton.textContent = "Iniciar";
  statusElement.textContent = "Pronto para focar?";
  render();
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    presetButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedMinutes = Number(button.dataset.minutes);
    resetButton.click();
  });
});

render();
