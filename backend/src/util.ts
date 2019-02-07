export function isDivisibleBy(x: number, y: number): boolean {
  if (y === 0) {
    return false;
  }
  return Number.isInteger(x / y);
}

export function getRandomElement(array: any[]): any {
  return array[Math.floor(Math.random() * array.length)];
}
