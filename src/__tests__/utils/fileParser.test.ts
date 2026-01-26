import { parseInputFile } from '../../utils/fileParser';

describe('parseInputFile', () => {
  test('parses single line correctly', () => {
    const input = '2.12,3.00';
    const result = parseInputFile(input);

    expect(result).toEqual([
      { owed: 2.12, paid: 3.00 },
    ]);
  });

  test('parses multiple lines correctly', () => {
    const input = `2.12,3.00
1.97,2.00
3.33,5.00`;
    const result = parseInputFile(input);

    expect(result).toEqual([
      { owed: 2.12, paid: 3.00 },
      { owed: 1.97, paid: 2.00 },
      { owed: 3.33, paid: 5.00 },
    ]);
  });

  test('handles empty lines', () => {
    const input = `2.12,3.00

1.97,2.00`;
    const result = parseInputFile(input);

    expect(result).toEqual([
      { owed: 2.12, paid: 3.00 },
      { owed: 1.97, paid: 2.00 },
    ]);
  });

  test('handles trailing newline', () => {
    const input = `2.12,3.00
`;
    const result = parseInputFile(input);

    expect(result).toEqual([
      { owed: 2.12, paid: 3.00 },
    ]);
  });

  test('throws error for invalid format', () => {
    const input = '2.12';

    expect(() => parseInputFile(input)).toThrow('Expected format "owed,paid"');
  });

  test('throws error for non-numeric values', () => {
    const input = 'abc,def';

    expect(() => parseInputFile(input)).toThrow('Invalid numbers');
  });

  test('throws error for negative amounts', () => {
    const input = '-2.12,3.00';

    expect(() => parseInputFile(input)).toThrow('cannot be negative');
  });

  test('includes line number in error messages', () => {
    const input = `2.12,3.00
invalid
1.97,2.00`;

    expect(() => parseInputFile(input)).toThrow('Line 2');
  });

  test('handles whitespace in lines', () => {
    const input = '  2.12,3.00  ';
    const result = parseInputFile(input);

    expect(result).toEqual([
      { owed: 2.12, paid: 3.00 },
    ]);
  });
});
