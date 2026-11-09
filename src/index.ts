import { addHighScore } from "./addHighScore.js";
import type { RoundResult } from "./getRoundResult.js";
import { countPossibleSecrets } from "./countPossibleSecrets.js";
import { createDigitValidator } from "./createDigitValidator.js";
import { generateSecret } from "./generateSecret.js";
import { getRoundResult } from "./getRoundResult.js";
import { submitGuess } from "./submitGuess.js";
import type { Round } from "./submitGuess.js";

let round: Round | null = null;
let startedAt = 0;
let isFinished = false;
const scoresKey = "bulls-and-cows-scores";
let scores: RoundResult[] = [];

try {
  const stored = JSON.parse(localStorage.getItem(scoresKey) ?? "[]");
  if (Array.isArray(stored)) {
    scores = stored.filter(
      (entry) =>
        entry &&
        Number.isInteger(entry.attempts) &&
        entry.attempts > 0 &&
        Number.isFinite(entry.elapsedMs) &&
        entry.elapsedMs >= 0 &&
        [2, 8, 10, 16].includes(entry.base) &&
        Number.isInteger(entry.length) &&
        entry.length >= 2 &&
        entry.length <= Math.min(6, entry.base),
    );
  }
} catch {
  scores = [];
}

const main = document.createElement("main");
main.className = "game";

const heading = document.createElement("h1");
heading.textContent = "Bulls and Cows";

const panel = document.createElement("section");
panel.className = "settings";
const settingsHeading = document.createElement("h2");
settingsHeading.textContent = "Настройки игры";

const baseLabel = document.createElement("label");
baseLabel.textContent = "Система счисления";
const baseSelect = document.createElement("select");
baseSelect.id = "base";
baseLabel.htmlFor = baseSelect.id;

const systems = [
  { base: 2, label: "bin — двоичная" },
  { base: 8, label: "oct — восьмеричная" },
  { base: 10, label: "dec — десятичная" },
  { base: 16, label: "hex — шестнадцатеричная" },
];

systems.forEach(({ base, label }) => {
  const option = document.createElement("option");
  option.value = String(base);
  option.textContent = label;
  baseSelect.append(option);
});
baseSelect.value = "10";

const lengthLabel = document.createElement("label");
lengthLabel.textContent = "Количество цифр";
const lengthSelect = document.createElement("select");
lengthSelect.id = "length";
lengthLabel.htmlFor = lengthSelect.id;

[2, 3, 4, 5, 6].forEach((length) => {
  const option = document.createElement("option");
  option.value = String(length);
  option.textContent = String(length);
  lengthSelect.append(option);
});
lengthSelect.value = "4";

const possibilities = document.createElement("p");
possibilities.className = "possibilities";
possibilities.setAttribute("aria-live", "polite");

function updateSettings(): void {
  const base = Number(baseSelect.value);
  Array.from(lengthSelect.options).forEach((option) => {
    option.disabled = Number(option.value) > base;
  });
  if (Number(lengthSelect.value) > base) lengthSelect.value = String(base);

  const count = countPossibleSecrets(Number(lengthSelect.value), base);
  possibilities.textContent = `Возможных секретов: ${count.toLocaleString("ru-RU")}`;
}

baseSelect.addEventListener("change", updateSettings);
lengthSelect.addEventListener("change", updateSettings);
updateSettings();

const startButton = document.createElement("button");
startButton.type = "button";
startButton.textContent = "Начать игру";

const guessLabel = document.createElement("label");
guessLabel.textContent = "Ваша попытка";
const guessInput = document.createElement("input");
guessInput.id = "guess";
guessInput.type = "text";
guessInput.autocomplete = "off";
guessInput.spellcheck = false;
guessInput.disabled = true;
guessLabel.htmlFor = guessInput.id;

const roundStatus = document.createElement("p");
roundStatus.className = "round-status";
roundStatus.setAttribute("aria-live", "polite");
roundStatus.textContent = "Выберите настройки и начните игру.";

const guessForm = document.createElement("form");
guessForm.className = "guess-form";
const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Проверить";
submitButton.disabled = true;
guessForm.append(guessLabel, guessInput, submitButton);

const historyHeading = document.createElement("h2");
historyHeading.textContent = "История попыток";
const historyList = document.createElement("ol");
historyList.className = "history";

const scoresHeading = document.createElement("h2");
scoresHeading.textContent = "Лучшие 10 результатов";
const scoresContainer = document.createElement("div");
scoresContainer.className = "scores-container";
const scoresTable = document.createElement("table");
scoresTable.className = "leaderboard";
scoresTable.setAttribute("aria-labelledby", "scores-heading");
scoresHeading.id = "scores-heading";
const scoresHead = document.createElement("thead");
const headingRow = document.createElement("tr");
["Место", "Система", "Длина", "Попытки", "Время, с"].forEach((label) => {
  const cell = document.createElement("th");
  cell.scope = "col";
  cell.textContent = label;
  headingRow.append(cell);
});
scoresHead.append(headingRow);
const scoresBody = document.createElement("tbody");
scoresTable.append(scoresHead, scoresBody);
scoresContainer.append(scoresTable);
const storageStatus = document.createElement("p");
storageStatus.className = "round-status";
storageStatus.setAttribute("aria-live", "polite");

function renderScores(): void {
  scoresBody.replaceChildren();
  scores.forEach((score, index) => {
    const row = document.createElement("tr");
    const system = systems.find((entry) => entry.base === score.base);
    const values = [
      String(index + 1),
      system?.label.split(" — ")[0] ?? String(score.base),
      String(score.length),
      String(score.attempts),
      (score.elapsedMs / 1000).toFixed(1),
    ];
    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    scoresBody.append(row);
  });
  if (scores.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Пока нет результатов";
    row.append(cell);
    scoresBody.append(row);
  }
}
renderScores();

function renderHistory(): void {
  historyList.replaceChildren();
  round?.history.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.guess} — bulls: ${entry.bulls}, cows: ${entry.cows}`;
    historyList.append(item);
  });
}

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!round || isFinished) return;

  const nextRound = submitGuess(round, guessInput.value);
  if (nextRound === round) {
    roundStatus.textContent =
      "Введите число нужной длины без повторяющихся цифр. Уже использованные попытки не добавляются.";
    return;
  }

  round = nextRound;
  renderHistory();
  guessInput.value = "";
  const result = getRoundResult(round, startedAt, performance.now());
  if (result) {
    isFinished = true;
    scores = addHighScore(scores, result);
    renderScores();
    try {
      localStorage.setItem(scoresKey, JSON.stringify(scores));
      storageStatus.textContent = "";
    } catch {
      storageStatus.textContent = "Не удалось сохранить результат.";
    }
    guessInput.disabled = true;
    submitButton.disabled = true;
    roundStatus.textContent = `Победа! Попыток: ${result.attempts}. Время: ${(result.elapsedMs / 1000).toFixed(1)} с.`;
    newGameButton.focus();
  } else {
    roundStatus.textContent = `Попыток: ${round.history.length}.`;
    guessInput.focus();
  }
});

startButton.addEventListener("click", () => {
  const base = Number(baseSelect.value);
  const length = Number(lengthSelect.value);
  const isAllowedDigit = createDigitValidator(base);
  round = { secret: generateSecret(length, base), base, length, history: [] };
  startedAt = performance.now();
  isFinished = false;
  newGameButton.disabled = false;
  renderHistory();

  submitButton.disabled = false;
  baseSelect.disabled = true;
  lengthSelect.disabled = true;
  startButton.disabled = true;
  guessInput.disabled = false;
  guessInput.maxLength = length;
  guessInput.inputMode = base === 16 ? "text" : "numeric";
  guessInput.oninput = () => {
    guessInput.value = [...guessInput.value.toLowerCase()]
      .filter(isAllowedDigit)
      .slice(0, length)
      .join("");
  };
  roundStatus.textContent = `Раунд начат. Длина: ${length}. Допустимые символы: ${"0123456789abcdef".slice(0, base)}.`;
  guessInput.focus();
});

const newGameButton = document.createElement("button");
newGameButton.type = "button";
newGameButton.textContent = "Новая игра";
newGameButton.disabled = true;
newGameButton.addEventListener("click", () => {
  round = null;
  startedAt = 0;
  isFinished = false;
  baseSelect.disabled = false;
  lengthSelect.disabled = false;
  startButton.disabled = false;
  submitButton.disabled = true;
  newGameButton.disabled = true;
  guessInput.disabled = true;
  guessInput.value = "";
  guessInput.oninput = null;
  renderHistory();
  updateSettings();
  roundStatus.textContent = "Выберите настройки и начните игру.";
  baseSelect.focus();
});

panel.append(
  settingsHeading,
  baseLabel,
  baseSelect,
  lengthLabel,
  lengthSelect,
  possibilities,
  startButton,
  guessForm,
  roundStatus,
  historyHeading,
  historyList,
  newGameButton,
  scoresHeading,
  scoresContainer,
  storageStatus,
);
main.append(heading, panel);
document.body.append(main);
