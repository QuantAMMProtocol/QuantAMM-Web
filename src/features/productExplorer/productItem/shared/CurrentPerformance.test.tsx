import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Product } from '../../../../models';
import { getCurrentPerformanceComponent } from './CurrentPerformance';

const renderPerformance = (currentPerformance: number | null | undefined) =>
  renderToStaticMarkup(
    getCurrentPerformanceComponent({
      currentPerformance,
    } as Product)
  );

describe('productItem/shared/CurrentPerformance view-model logic', () => {
  it('formats missing and finite performance values as user-facing text', () => {
    expect(renderPerformance(undefined)).toContain('N/A');
    expect(renderPerformance(Number.NaN)).toContain('N/A');
    expect(renderPerformance(0)).toContain('0%');
    expect(renderPerformance(12.34)).toContain('+12.3%');
    expect(renderPerformance(-1200)).toContain('-1.2K%');
  });
});
