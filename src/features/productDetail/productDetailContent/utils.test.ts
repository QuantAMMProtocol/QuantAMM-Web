import { describe, expect, it } from 'vitest';
import { norm, toTwoDecimals, truncateMiddle } from './utils';

describe('productDetailContent/utils view-model logic', () => {
  it('truncates long strings in the middle and keeps short values unchanged', () => {
    expect(truncateMiddle('abcdef', 3, 3)).toBe('abcdef');
    expect(truncateMiddle('abcdefghijklmnopqrstuvwxyz', 4, 4)).toBe(
      'abcd…wxyz'
    );
    expect(truncateMiddle(null, 3, 3)).toBe('');
  });

  it('formats values to two decimals with null and non-finite handling', () => {
    expect(toTwoDecimals(12.345)).toBe('12.35');
    expect(toTwoDecimals('9')).toBe('9.00');
    expect(toTwoDecimals(null)).toBe('—');
    expect(toTwoDecimals('abc')).toBe('abc');
  });

  it('normalizes strings for robust comparisons', () => {
    expect(norm("  QuantAMM’s   \"Alpha\"!  ")).toBe("quantamm's 'alpha'");
    expect(norm('BTC/ETH   +   USDC')).toBe('btc eth usdc');
  });
});
