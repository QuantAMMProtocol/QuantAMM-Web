import { Product } from '../../../../models';

export const getCurrentPerformanceComponent = (product: Product) => {
  const { currentPerformance } = product;

  if (currentPerformance == null || Number.isNaN(currentPerformance)) {
    return <span style={{ color: 'var(--grey)' }}>N/A</span>;
  }

  if (currentPerformance === 0) {
    return <span style={{ color: 'var(--grey)' }}>0%</span>;
  }

  const compactPerformance = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumSignificantDigits: 3,
  }).format(currentPerformance);

  return (
    <span
      style={{
        color: currentPerformance > 0 ? 'var(--green)' : 'var(--red)',
      }}
    >
      {currentPerformance > 0 ? `+${compactPerformance}` : compactPerformance}%
    </span>
  );
};
