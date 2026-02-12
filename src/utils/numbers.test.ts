import { describe, expect, it, vi } from 'vitest';
import {
  blockInvalidNumberInput,
  fNum,
  isGreaterThanZeroValidation,
  isValidNumber,
  safeParseFixedBigInt,
  safeSum,
  safeTokenFormat,
} from './numbers';

describe('numbers utilities view-model logic', () => {
  it('sums number-like values safely', () => {
    expect(safeSum([1, '2.5', 3n])).toBe('6.5');
  });

  it('parses fixed values to bigint while truncating extra decimals', () => {
    expect(safeParseFixedBigInt('1.2345', 2)).toBe(123n);
    expect(safeParseFixedBigInt('1,234.567', 2)).toBe(123456n);
    expect(safeParseFixedBigInt('42', 0)).toBe(42n);
  });

  it('formats representative values for APR, token, and percentage outputs', () => {
    expect(fNum('apr', 0.1)).toBe('10.00%');
    expect(fNum('percentage', 0.42)).toBe('42%');
    expect(fNum('token', 0.000001)).toBe('< 0.00001');
  });

  it('validates numeric text and greater-than-zero constraints', () => {
    expect(isValidNumber('123.45')).toBe(true);
    expect(isValidNumber('abc')).toBe(false);
    expect(isGreaterThanZeroValidation('1')).toBe(true);
    expect(isGreaterThanZeroValidation('0')).toBe(
      'Amount must be greater than 0'
    );
  });

  it('blocks invalid number input keys for numeric fields', () => {
    const preventDefault = vi.fn();
    const makeEvent = (key: string) =>
      ({
        key,
        preventDefault,
      }) as any;

    blockInvalidNumberInput(makeEvent('e'));
    blockInvalidNumberInput(makeEvent('E'));
    blockInvalidNumberInput(makeEvent('+'));
    blockInvalidNumberInput(makeEvent('-'));
    blockInvalidNumberInput(makeEvent('1'));

    expect(preventDefault).toHaveBeenCalledTimes(4);
  });

  it('formats token amounts safely and returns placeholder for missing values', () => {
    expect(safeTokenFormat(null, 18)).toBe('-');
    expect(safeTokenFormat(1_000_000_000_000_000_000n, 18)).toBe('1');
  });
});
