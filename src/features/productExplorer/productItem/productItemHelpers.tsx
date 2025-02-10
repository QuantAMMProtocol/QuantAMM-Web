import { ReactNode } from 'react';
import { Product } from '../../../models';

export const getTimeDifference = (createTime: string): ReactNode => {
  const createdDate = new Date(createTime);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  return (
    <>
      {years > 0 && `${years}y `}
      {months > 0 && `${months}m `}
      {years == 0 && days > 0 && `${days}d`}
    </>
  );
};

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

export const getTvl = (product: Product): string => {
  const value = product.dynamicData.totalLiquidity;
  return formatValueToUsd(value);
};

export const getCurrentPerformanceComponent = (product: Product) => {
  const { currentPerformance } = product;

  const compactPerformance = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumSignificantDigits: 3,
  }).format(currentPerformance);

  return currentPerformance === 0 ? (
    <span style={{ color: 'rgba(166, 166, 166, 0.9)' }}>0%</span>
  ) : (
    <span
      style={{
        color:
          currentPerformance > 0
            ? 'rgba(2, 189, 46, 0.9)'
            : 'rgba(166, 0, 0, 0.9)',
      }}
    >
      {currentPerformance > 0 ? `+${compactPerformance}` : compactPerformance}%
    </span>
  );
};

export const getCurrentPrice = (product: Product) => {
  const { sharePrice } = product.timeSeries[product.timeSeries.length - 1];
  return formatValueToUsd(sharePrice.toFixed(2));
};
