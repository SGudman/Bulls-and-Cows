import { countPossibleSecrets } from "./countPossibleSecrets.js";
import { createDigitValidator } from "./createDigitValidator.js";

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

startButton.addEventListener("click", () => {
  const base = Number(baseSelect.value);
  const length = Number(lengthSelect.value);
  const isAllowedDigit = createDigitValidator(base);

  baseSelect.disabled = true;
  lengthSelect.disabled = true;
  startButton.disabled = true;
  guessInput.disabled = false;
  guessInput.maxLength = length;
  guessInput.inputMode = base === 16 ? "text" : "numeric";
  guessInput.addEventListener("input", () => {
    guessInput.value = [...guessInput.value.toLowerCase()]
      .filter(isAllowedDigit)
      .slice(0, length)
      .join("");
  });
  roundStatus.textContent = `Раунд начат. Длина: ${length}. Допустимые символы: ${"0123456789abcdef".slice(0, base)}.`;
  guessInput.focus();
});

panel.append(
  settingsHeading,
  baseLabel,
  baseSelect,
  lengthLabel,
  lengthSelect,
  possibilities,
  startButton,
  guessLabel,
  guessInput,
  roundStatus,
);
main.append(heading, panel);
document.body.append(main);
