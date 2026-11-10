import { countPossibleSecrets } from "../src/countPossibleSecrets";

describe("countPossibleSecrets", () => {
  test.each([
    [0, 10, 1],
    [0, 0, 1],
    [1, 10, 10],
    [2, 2, 2],
    [3, 2, 0],
    [2, 8, 56],
    [4, 10, 5040],
    [6, 16, 5765760],
  ])("counts length %i in base %i as %i", (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  test("returns correct results on repeated calls with different settings", () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 8)).toBe(56);
  });
});
