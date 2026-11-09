import { submitGuess } from "../src/submitGuess";

function createRound(secret = "0123", base = 10) {
  return {
    secret,
    base,
    length: secret.length,
    history: [],
  };
}

describe("submitGuess", () => {
  test("adds the normalized guess and bulls/cows", () => {
    const round = createRound("ab01", 16);
    const result = submitGuess(round, "AB10");

    expect(result.history).toEqual([{ guess: "ab10", bulls: 2, cows: 2 }]);
  });

  test("creates a new state and history without modifying the previous ones", () => {
    const round = createRound();
    Object.freeze(round.history);
    Object.freeze(round);

    const result = submitGuess(round, "0132");

    expect(result).not.toBe(round);
    expect(result.history).not.toBe(round.history);
    expect(round.history).toEqual([]);
    expect(result.secret).toBe(round.secret);
    expect(result.base).toBe(round.base);
    expect(result.length).toBe(round.length);
  });

  test("keeps previous history entries unchanged", () => {
    const first = submitGuess(createRound(), "0132");
    const entry = first.history[0];
    Object.freeze(entry);
    Object.freeze(first.history);
    Object.freeze(first);

    const second = submitGuess(first, "3210");

    expect(second.history).toEqual([
      { guess: "0132", bulls: 2, cows: 2 },
      { guess: "3210", bulls: 0, cows: 4 },
    ]);
    expect(second.history[0]).toBe(entry);
    expect(first.history).toHaveLength(1);
  });

  test.each(["", "012", "01234", "0012", "01ab"])(
    "rejects invalid guess %s without changing state",
    (guess) => {
      const round = createRound();
      expect(submitGuess(round, guess)).toBe(round);
    },
  );

  test("ignores repeated guesses regardless of hex case", () => {
    const first = submitGuess(createRound("ab01", 16), "AB10");

    expect(submitGuess(first, "ab10")).toBe(first);
    expect(first.history).toHaveLength(1);
  });
});
