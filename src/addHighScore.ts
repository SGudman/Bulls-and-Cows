import type { RoundResult } from "./getRoundResult.js";

export function addHighScore(
  scores: readonly RoundResult[],
  result: RoundResult,
): RoundResult[] {
  return [...scores, result]
    .sort((a, b) => a.attempts - b.attempts || a.elapsedMs - b.elapsedMs)
    .slice(0, 10);
}
