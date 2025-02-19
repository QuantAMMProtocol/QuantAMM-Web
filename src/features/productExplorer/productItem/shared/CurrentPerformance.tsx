import { Product } from '../../../../models';

export const getCurrentPerformanceComponent = (product: Product) => {
  const { currentPerformance } = product;

  if (!currentPerformance) {
    return <span style={{ color: 'rgba(166, 166, 166, 0.9)' }}>N/A</span>;
  }

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
