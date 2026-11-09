import { generateSecret } from "../src/generateSecret";

describe("generateSecret", () => {
  test.each([
    [2, 2],
    [6, 8],
    [4, 10],
    [6, 16],
  ])("returns %i unique digits for base %i", (length, base) => {
    const secret = generateSecret(length, base, () => 0.5);

    expect(secret).toHaveLength(length);
    expect(new Set(secret).size).toBe(length);
    expect(
      [...secret].every((digit) =>
        "0123456789abcdef".slice(0, base).includes(digit),
      ),
    ).toBe(true);
  });

  test("preserves a leading zero", () => {
    const secret = generateSecret(4, 10, () => 0);

    expect(secret).toHaveLength(4);
    expect(secret[0]).toBe("0");
    expect(new Set(secret).size).toBe(4);
  });

  test("uses the supplied random source", () => {
    const random = jest.fn(() => 0.5);

    generateSecret(4, 10, random);

    expect(random).toHaveBeenCalled();
  });

  test("repeats the result for the same deterministic random source", () => {
    const first = generateSecret(4, 10, () => 0.5);
    const second = generateSecret(4, 10, () => 0.5);

    expect(first).toHaveLength(4);
    expect(second).toBe(first);
  });

  test("can generate hexadecimal letters", () => {
    const secret = generateSecret(6, 16, () => 0.99);

    expect(secret).toHaveLength(6);
    expect(secret).toMatch(/[a-f]/i);
    expect(new Set(secret).size).toBe(6);
  });
});
