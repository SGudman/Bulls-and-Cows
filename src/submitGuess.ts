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
  void guess;
  return round;
}
