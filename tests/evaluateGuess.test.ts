import { evaluateGuess } from "../src/evaluateGuess";

describe("evaluateGuess", () => {
  test.each([
    ["1234", "1234", 4, 0],
    ["1234", "4321", 0, 4],
    ["1234", "1350", 1, 1],
    ["1234", "5678", 0, 0],
    ["0123", "0456", 1, 0],
    ["01", "10", 0, 2],
    ["a1b2", "A1B2", 4, 0],
    ["a1b2", "2BA1", 0, 4],
  ])(
    "compares secret %s with guess %s: %i bulls and %i cows",
    (secret, guess, bulls, cows) => {
      expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
    },
  );
});
