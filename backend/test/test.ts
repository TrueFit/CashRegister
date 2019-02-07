import * as assert from 'assert';
import { describe, it } from 'mocha';

import { DENOMINATIONS } from '../src/constants';
import { getChangeResponse } from '../src/cashregister';
import { isDivisibleBy } from '../src/util';

describe('CashRegister', () => {
  const CCY = 'USD';

  describe('getChangeResponse', () => {
    const badInputs = [
      '',            // Empty
      ',',           // No values, just delimiters
      '\n',          // No values, just newline
      'NaN',         // Not a number
      ',1.00',       // Missing first value
      '1.00,',       // Missing second value
      '1,1',         // Missing fractional portions
      '1.0,1.0',     // Fractional portion too short
      '1.000,1.000', // Fractional portion too long
      '-1.00,1.00',  // Negative number
    ];
    for (const badInput of badInputs) {
      it(`should throw errors for invalid input "${badInput}"`, () => {
        assert.throws(
          () => {
            getChangeResponse(badInput, CCY);
          },
          TypeError,
          `Should throw error for bad input "${badInput}"`
        );
      });
    }

    it('should handle a single payment', () => {
      assert.deepStrictEqual(
        getChangeResponse('1.00,2.00', CCY),
        { response: [ '1 dollar' ] }
      );
    });

    it('should handle multiple payments', () => {
      assert.deepStrictEqual(
        getChangeResponse('2.12,3.00\n1.97,2.00\n3.33,5.00', CCY),
        {
          response: [
            '3 quarters,1 dime,3 pennies',
            '3 pennies',
            '1 dollar,2 quarters,1 dime,1 nickel,2 pennies',
          ]
        }
      );
    });

    it('should handle trailing whitespace', () => {
      assert.deepStrictEqual(
        getChangeResponse('1.00,2.00\n', CCY),
        { response: [ '1 dollar' ] }
      );
    });

    it('should return random denominations for owed amounts divisible by 3', () => {
      // There's a small chance that this test results in a false positive. If
      // it fails, try running it again.
      const result1 = getChangeResponse('3.00,3.25');
      const result2 = getChangeResponse('3.00,3.25');
      assert.notStrictEqual(result1, result2);
    });

  });
});

describe('Utilities', () => {
  describe('isDivisibleBy', () => {
    [ [ 10, 1 ], [ 30, 3 ], [  5, 5 ] ].forEach((pair: [ number, number ]) => {
      it(`should say ${pair[1]} divides ${pair[0]}`, () => {
        assert(isDivisibleBy(pair[0], pair[1]));
      });
    });

    [ [ 5, 3 ], [ 5, 0 ], [ 0, 0 ] ].forEach((pair: [ number, number ]) => {
      it(`should say ${pair[1]} does not divide ${pair[0]}`, () => {
        assert(!isDivisibleBy(pair[0], pair[1]));
      });
    });

  });
});

describe('Constants', () => {
  describe('DENOMINATIONS', () => {
    it('Should be sorted by value for each currency', () => {
      for (const ccy of Object.keys(DENOMINATIONS)) {
        const denom = DENOMINATIONS[ccy];
        assert.deepStrictEqual(
          denom.sort((a: any, b: any) => a.value - b.value),
          denom
        );
      }
    });
  });
});
