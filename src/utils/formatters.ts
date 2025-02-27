export const currencyFormatter = (
  value: number | string,
  currency = 'USD',
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) => {
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numberValue);
};

export const percentageFormatter = (
  value: number,
  maximumSignificantDigits = 2,
  maximumFractionDigits = 3,
  minimumFractionDigits = 1
) => {
  return `${Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumSignificantDigits,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)}%`;
};
