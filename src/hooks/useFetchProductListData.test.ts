import { describe, expect, it } from 'vitest';
import {
  buildWhereClauseFromFilters,
  getProductMapLoadingState,
  isStubDataEnabled,
} from './useFetchProductListData';

describe('useFetchProductListData view-model logic', () => {
  it('detects stub data mode from env-like flag values', () => {
    expect(isStubDataEnabled('true')).toBe(true);
    expect(isStubDataEnabled('false')).toBe(false);
    expect(isStubDataEnabled(undefined)).toBe(false);
  });

  it('builds graph where-clause from active filters and applies blacklist tag filter', () => {
    const where = buildWhereClauseFromFilters({
      chain: ['BASE', 'ARBITRUM'],
      poolType: ['QUANT_AMM_WEIGHTED'],
      minTvl: ['25000'],
    });

    expect(where).toEqual({
      chainIn: ['BASE', 'ARBITRUM'],
      poolTypeIn: ['QUANT_AMM_WEIGHTED'],
      minTvl: 25000,
      tagNotIn: ['BLACK_LISTED'],
    });
  });

  it('computes product-map loading state using stub/non-stub branch rules', () => {
    expect(
      getProductMapLoadingState({
        loading: false,
        stubDataLoading: true,
        baseProductsLoading: false,
        fullProductsLoading: false,
        fullProductsError: undefined,
        isStubData: true,
      })
    ).toBe(true);

    expect(
      getProductMapLoadingState({
        loading: false,
        stubDataLoading: false,
        baseProductsLoading: true,
        fullProductsLoading: false,
        fullProductsError: undefined,
        isStubData: false,
      })
    ).toBe(true);

    expect(
      getProductMapLoadingState({
        loading: false,
        stubDataLoading: false,
        baseProductsLoading: false,
        fullProductsLoading: false,
        fullProductsError: undefined,
        isStubData: false,
      })
    ).toBe(false);

    expect(
      getProductMapLoadingState({
        loading: false,
        stubDataLoading: false,
        baseProductsLoading: false,
        fullProductsLoading: true,
        fullProductsError: undefined,
        isStubData: false,
      })
    ).toBe(true);

    expect(
      getProductMapLoadingState({
        loading: false,
        stubDataLoading: false,
        baseProductsLoading: false,
        fullProductsLoading: true,
        fullProductsError: {
          status: 500,
          data: {},
        },
        isStubData: false,
      })
    ).toBe(false);
  });
});
