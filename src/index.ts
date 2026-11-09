import { countPossibleSecrets } from "./countPossibleSecrets.js";

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

panel.append(
  settingsHeading,
  baseLabel,
  baseSelect,
  lengthLabel,
  lengthSelect,
  possibilities,
);
main.append(heading, panel);
document.body.append(main);
