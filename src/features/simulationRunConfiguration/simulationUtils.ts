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

/**
 * Sort an array of Ethereum addresses in ascending order,
 * mimicking the Solidity bubble sort:
 *
 * if (tokens[j] > tokens[j + 1]) { swap }
 */
export function sortTokenAddresses(addresses: string[]): string[] {
  // Make a shallow copy so we don't mutate the original
  const tokens = [...addresses];

  for (let i = 0; i < tokens.length - 1; ++i) {
    for (let j = 0; j < tokens.length - i - 1; ++j) {
      // Compare as lowercase hex strings; same length, so lexicographic === numeric order
      if (tokens[j].toLowerCase() > tokens[j + 1].toLowerCase()) {
        const tmp = tokens[j];
        tokens[j] = tokens[j + 1];
        tokens[j + 1] = tmp;
      }
    }
  }

  return tokens;
}