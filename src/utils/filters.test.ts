import { describe, expect, it } from 'vitest';
import { updateFilters } from './filters';

describe('filters utility view-model logic', () => {
  it('adds and removes categorical filters as toggles', () => {
    const added = updateFilters(
      { filterCategory: 'strategy', filter: 'Momentum' },
      {}
    );
    expect(added).toEqual({ strategy: ['Momentum'] });

    const addedSecond = updateFilters(
      { filterCategory: 'strategy', filter: 'Channel Following' },
      added
    );
    expect(addedSecond).toEqual({
      strategy: ['Momentum', 'Channel Following'],
    });

    const removed = updateFilters(
      { filterCategory: 'strategy', filter: 'Momentum' },
      addedSecond
    );
    expect(removed).toEqual({ strategy: ['Channel Following'] });

    const removedAll = updateFilters(
      { filterCategory: 'strategy', filter: 'Channel Following' },
      removed
    );
    expect(removedAll).toEqual({});
  });

  it('updates min tvl filter using string values', () => {
    const result = updateFilters({ filterCategory: 'tvl', minTvl: 25000 }, {});
    expect(result).toEqual({ minTvl: ['25000'] });
  });

  it('clears filters when payload is not actionable', () => {
    expect(updateFilters({}, { strategy: ['Momentum'] })).toEqual({});
  });
});
