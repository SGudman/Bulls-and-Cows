export function createDigitValidator(base: number): (char: string) => boolean {
  const digits = "0123456789abcdef".slice(0, base);

  return (char) => char.length === 1 && digits.includes(char.toLowerCase());
}
