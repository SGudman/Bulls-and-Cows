import type { Round } from "./submitGuess.js";

export type RoundResult = {
  readonly attempts: number;
  readonly elapsedMs: number;
  readonly length: number;
  readonly base: number;
};

export function getRoundResult(
  round: Round,
  startedAt: number,
  finishedAt: number,
): RoundResult | null {
  const lastGuess = round.history[round.history.length - 1];
  if (!lastGuess || lastGuess.bulls !== round.length) return null;

  return {
    attempts: round.history.length,
    elapsedMs: finishedAt - startedAt,
    length: round.length,
    base: round.base,
  };
}
