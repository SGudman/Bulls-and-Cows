import { isValidGuess } from "../src/isValidGuess";

describe("isValidGuess", () => {
  test.each([
    ["01", 2, 2, true],
    ["012345", 6, 8, true],
    ["0123", 4, 10, true],
    ["aB09", 4, 16, true],
    ["123", 4, 10, false],
    ["12345", 4, 10, false],
    ["", 4, 10, false],
    ["02", 2, 2, false],
    ["78", 2, 8, false],
    ["1a", 2, 10, false],
    ["fg", 2, 16, false],
    ["1123", 4, 10, false],
    ["aA01", 4, 16, false],
    ["1 23", 4, 10, false],
    ["-123", 4, 10, false],
  ])(
    "validates %s of length %i in base %i as %s",
    (guess, length, base, expected) => {
      expect(isValidGuess(guess, length, base)).toBe(expected);
    },
  );
});
