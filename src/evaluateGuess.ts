export function evaluateGuess(
  secret: string,
  guess: string,
): { bulls: number; cows: number } {
  const secretDigits = [...secret.toLowerCase()];
  const guessDigits = [...guess.toLowerCase()];
  const bulls = guessDigits.filter(
    (digit, index) => digit === secretDigits[index],
  ).length;
  const matches = guessDigits.filter((digit) =>
    secretDigits.includes(digit),
  ).length;

  return { bulls, cows: matches - bulls };
}
