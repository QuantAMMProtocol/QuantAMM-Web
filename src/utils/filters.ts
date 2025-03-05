import { FilterMap } from '../models';

export interface FilterPayload {
  filterCategory?: string;
  filter?: string;
  minTvl?: number;
}

export const updateFilters = (
  payload: FilterPayload,
  activeFilters: FilterMap
) => {
  const { filterCategory, filter, minTvl } = payload;
  const newFilters = { ...activeFilters };

  if (filterCategory && filter) {
    if (newFilters[filterCategory]?.includes(filter)) {
      newFilters[filterCategory] = newFilters[filterCategory].filter(
        (f) => f !== filter
      );
      if (newFilters[filterCategory].length === 0)
        delete newFilters[filterCategory];
    } else {
      newFilters[filterCategory] = newFilters[filterCategory]
        ? [...newFilters[filterCategory], filter]
        : [filter];
    }
    return newFilters;
  } else if (filterCategory === 'tvl') {
    return {
      ...activeFilters,
      minTvl: [minTvl?.toString() ?? ''],
    };
  } else {
    return {};
  }
};
