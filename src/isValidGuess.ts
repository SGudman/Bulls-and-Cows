import { createDigitValidator } from "./createDigitValidator.js";

export function isValidGuess(
  guess: string,
  length: number,
  base: number,
): boolean {
  const digits = [...guess.toLowerCase()];

  return (
    digits.length === length &&
    digits.every(createDigitValidator(base)) &&
    new Set(digits).size === length
  );
}
