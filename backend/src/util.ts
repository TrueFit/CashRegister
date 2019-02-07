export function isDivisibleBy(x: number, y: number): boolean {
  if (y === 0) {
    return false;
  }
  return Number.isInteger(x / y);
}
