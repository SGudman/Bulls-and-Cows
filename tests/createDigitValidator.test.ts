import { createDigitValidator } from "../src/createDigitValidator";

describe("createDigitValidator", () => {
  test.each([
    [2, "0", true],
    [2, "1", true],
    [2, "2", false],
    [8, "7", true],
    [8, "8", false],
    [10, "9", true],
    [10, "a", false],
    [16, "a", true],
    [16, "F", true],
    [16, "g", false],
    [16, "", false],
    [16, "ab", false],
    [10, " ", false],
    [10, "-", false],
  ])("base %i validates %s as %s", (base, char, expected) => {
    expect(createDigitValidator(base)(char)).toBe(expected);
  });

  test("keeps validators for different bases independent", () => {
    const binary = createDigitValidator(2);
    const hexadecimal = createDigitValidator(16);

    expect(binary("a")).toBe(false);
    expect(hexadecimal("a")).toBe(true);
    expect(binary("1")).toBe(true);
  });
});
