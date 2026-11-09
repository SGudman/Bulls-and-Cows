import { evaluateGuess } from "./evaluateGuess";
import { isValidGuess } from "./isValidGuess";

export type GuessEntry = {
  readonly guess: string;
  readonly bulls: number;
  readonly cows: number;
};

export type Round = {
  readonly secret: string;
  readonly base: number;
  readonly length: number;
  readonly history: readonly GuessEntry[];
};

export function submitGuess(round: Round, guess: string): Round {
  const normalizedGuess = guess.toLowerCase();
  if (!isValidGuess(normalizedGuess, round.length, round.base)) return round;
  if (round.history.some((entry) => entry.guess === normalizedGuess))
    return round;

  const result = evaluateGuess(round.secret, normalizedGuess);
  const entry = { guess: normalizedGuess, ...result };

  return { ...round, history: [...round.history, entry] };
}
