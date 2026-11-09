import { getRoundResult } from "../src/getRoundResult";
import { submitGuess } from "../src/submitGuess";

function createRound() {
  return { secret: "0123", length: 4, base: 10, history: [] };
}

describe("getRoundResult", () => {
  test("returns null before any attempts", () => {
    expect(getRoundResult(createRound(), 1000, 2000)).toBeNull();
  });

  test("returns null when the secret is not guessed", () => {
    const round = submitGuess(createRound(), "0132");
    expect(getRoundResult(round, 1000, 2000)).toBeNull();
  });

  test("returns attempts, elapsed milliseconds and settings on victory", () => {
    const first = submitGuess(createRound(), "0132");
    const won = submitGuess(first, "0123");

    expect(getRoundResult(won, 1000, 4500)).toEqual({
      attempts: 2,
      elapsedMs: 3500,
      length: 4,
      base: 10,
    });
  });

  test("handles a first-attempt victory with zero elapsed time", () => {
    const won = submitGuess(createRound(), "0123");

    expect(getRoundResult(won, 1000, 1000)).toEqual({
      attempts: 1,
      elapsedMs: 0,
      length: 4,
      base: 10,
    });
  });

  test("handles hex case and preserves the round", () => {
    const won = submitGuess(
      { secret: "ab", length: 2, base: 16, history: [] },
      "AB",
    );
    Object.freeze(won.history);
    Object.freeze(won);

    expect(getRoundResult(won, 0, 500)).toEqual({
      attempts: 1,
      elapsedMs: 500,
      length: 2,
      base: 16,
    });
    expect(won.history).toEqual([{ guess: "ab", bulls: 2, cows: 0 }]);
  });
});
