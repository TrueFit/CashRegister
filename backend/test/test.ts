import * as assert from 'assert';
import { describe, it } from 'mocha';
import { getChangeResponse } from '../src/cashregister';

describe('CashRegister', () => {
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
            getChangeResponse(badInput);
          },
          TypeError,
          `Should throw error for bad input "${badInput}"`
        );
      });
    }

    it('should handle a single payment', () => {
      assert.deepStrictEqual(
        getChangeResponse('2.00,1.00'),
        { response: [ '1 dollar' ] }
      );
    });

    it('should handle multiple payments', () => {
      assert.deepStrictEqual(
        getChangeResponse('2.00,1.00\n4.00,3.00'),
        { response: [ '1 dollar', '1 dollar' ] }
      );
    });

    it('should handle trailing whitespace', () => {
      assert.deepStrictEqual(
        getChangeResponse('2.00,1.00\n'),
        { response: [ '1 dollar' ] }
      );
    });

  });
});
