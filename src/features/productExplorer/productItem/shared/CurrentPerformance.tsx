import { Product } from '../../../../models';

export const getCurrentPerformanceComponent = (product: Product) => {
  const { currentPerformance } = product;

  if (!currentPerformance) {
    return <span style={{ color: 'var(--grey)' }}>N/A</span>;
  }

  const compactPerformance = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumSignificantDigits: 3,
  }).format(currentPerformance);

  return currentPerformance === 0 ? (
    <span style={{ color: 'var(--grey)' }}>0%</span>
  ) : (
    <span
      style={{
        color: currentPerformance > 0 ? 'var(--green)' : 'var(--red)',
      }}
    >
      {currentPerformance > 0 ? `+${compactPerformance}` : compactPerformance}%
    </span>
  );
};
