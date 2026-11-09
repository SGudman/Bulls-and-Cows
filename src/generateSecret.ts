export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string {
  const digits = [..."0123456789abcdef".slice(0, base)];

  return Array.from({ length }).reduce<string>((secret) => {
    const index = Math.floor(random() * digits.length);
    const [digit] = digits.splice(index, 1);

    return secret + digit;
  }, "");
}
