//note this still works with ts number so there can be precision issues with very large numbers
export function to18Decimals(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number: ${value}`);
  }

  let s = value.toString();

  if (s.includes('e') || s.includes('E')) {
    s = value.toFixed(40);
  }

  s = s.trim();

  let sign = '';
  if (s.startsWith('-')) {
    sign = '-';
    s = s.slice(1);
  }

  if (!/^\d+(\.\d+)?$/.test(s)) {
    throw new Error(`Invalid decimal representation from number: ${s}`);
  }

  const parts = s.split('.');
  const intPart = parts[0];
  let fracPart = parts[1] ?? '';

  fracPart = fracPart.replace(/0+$/, '');

  if (fracPart.length > 18) {
    fracPart = fracPart.slice(0, 18);
  }

  const fracPadded = (fracPart + '000000000000000000').slice(0, 18);

  let combined = intPart + fracPadded;

  combined = combined.replace(/^0+/, '');
  if (combined === '') {
    combined = '0';
    sign = ''; // -0 -> 0
  }

  return sign + combined;
}
