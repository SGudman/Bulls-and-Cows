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
  void round;
  void startedAt;
  void finishedAt;
  return null;
}
