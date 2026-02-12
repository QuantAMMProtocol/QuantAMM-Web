import { describe, expect, it } from 'vitest';
import { currencyFormatter, percentageFormatter } from './formatters';

describe('formatters utility view-model logic', () => {
  it('formats currency values and handles invalid input', () => {
    expect(currencyFormatter(1234.5)).toBe('$1,234.50');
    expect(currencyFormatter('99.99', 'EUR')).toContain('99.99');
    expect(currencyFormatter('not-a-number')).toBe('');
  });

  it('formats compact percentage values with suffix', () => {
    expect(percentageFormatter(12.345)).toBe('12%');
    expect(percentageFormatter(1234, 3, 2, 0)).toBe('1.23K%');
  });
});
