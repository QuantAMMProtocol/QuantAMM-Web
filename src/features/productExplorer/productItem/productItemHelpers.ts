import { Product } from '../../../models';

const formatValueToUsd = (value: string) => {
  const valueFloat = parseFloat(value);
  const valueCompact = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(valueFloat);
  return `$${valueCompact}`;
};

export const getTvl = (product: Product): string | undefined => {
  const value = product.dynamicData?.totalLiquidity;
  return value ? formatValueToUsd(value) : undefined;
};

export const getCurrentPrice = (product: Product) => {
  if (!product.timeSeries) {
    return undefined;
  }
  const lastTimeSeriesEntry =
    product.timeSeries?.[product.timeSeries?.length - 1];
  if (!lastTimeSeriesEntry?.sharePrice) {
    return formatValueToUsd('0');
  }
  return formatValueToUsd(lastTimeSeriesEntry.sharePrice.toFixed(2));
};
