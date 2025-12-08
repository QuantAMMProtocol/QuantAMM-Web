import { Chain, LiquidityPool } from './simulationRunConfigModels';

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
/**
 * Build a ruleParameters string (for input.ts) from the prepared smartContractParameters.
 *
 * - smartContractParameters:
 *     key   = factorName
 *     value = factor values per token (string[]), **in alphabetical coinCode order**
 *
 * - If isLambda:
 *   - Only include the "lambda" factorName.
 *   - Return a single array string: [v1, v2, ...]
 *
 * - If not isLambda:
 *   - Exclude the "lambda" factorName.
 *   - Return array of arrays, ordered by smartContractSortOrder.
 *
 * - Within each row, values are reordered from "alphabetical coinCode order"
 *   into "token address order" as defined by addressSortOrder.
 */
export function buildRuleParametersString(
  pool: LiquidityPool,
  smartContractParameters: Record<string, string[]>,
  addressSortOrder: string[],
  targetChain: Chain,
  isLambda: boolean
): string {
  interface TokenInfo {
    coinCode: string;
    address: string;
  }

  // 1. Build factorName -> smartContractSortOrder map
  const sortOrderByFactor = new Map<string, number>();

  pool.updateRule.updateRuleParameters.forEach((param) => {
    const sortOrder = param.smartContractSortOrder ?? 0;
    const existing = sortOrderByFactor.get(param.factorName);

    if (existing === undefined || sortOrder < existing) {
      sortOrderByFactor.set(param.factorName, sortOrder);
    }
  });

  // 2. Build token infos (coinCode + address on target chain)
  const tokenInfosUnsorted: TokenInfo[] = pool.poolConstituents
    .map((pc) => {
      const address: string =
        pc.coin.deploymentByChain.get(targetChain)?.address ?? '';
      return { coinCode: pc.coin.coinCode, address: address.toLowerCase() };
    })
    .filter((t) => !!t.address);

  // 3. Sort constituents by coinCode to match smartContractParameters arrays
  const tokensSortedByCode: TokenInfo[] = tokenInfosUnsorted
    .slice()
    .sort((a, b) => a.coinCode.localeCompare(b.coinCode));

  // 4. Determine factorNames based on isLambda
  let factorNames = Object.keys(smartContractParameters);
  if (isLambda) {
    factorNames = factorNames.filter((f) => f === 'lamb');
  } else {
    factorNames = factorNames.filter((f) => f !== 'lamb');
  }

  // 5. Order factorNames (only matters when not lambda)
  const orderedFactorNames = isLambda
    ? factorNames // only 'lamb' or empty
    : factorNames.sort((a, b) => {
        const orderA = sortOrderByFactor.get(a);
        const orderB = sortOrderByFactor.get(b);

        if (orderA == null && orderB == null) {
          return a.localeCompare(b);
        }
        if (orderA == null) return 1;
        if (orderB == null) return -1;

        if (orderA !== orderB) return orderA - orderB;
        return a.localeCompare(b);
      });

  // Helper to build values for a single factorName in address order
  const buildValuesForFactor = (factorName: string): string[] => {
    const valuesInCodeOrder = smartContractParameters[factorName] ?? [];

    // Map address -> value using coin-code order
    const valueByAddress = new Map<string, string>();
    tokensSortedByCode.forEach((token, codeIndex) => {
      const value = valuesInCodeOrder[codeIndex];
      if (value === undefined) return;
      valueByAddress.set(token.address, value);
    });

    // Emit values in addressSortOrder
    return addressSortOrder.map((addr) => {
      if (!addr) return '';
      return valueByAddress.get(addr.toLowerCase()) ?? '';
    });
  };

  if (isLambda) {
    const lambdaName = orderedFactorNames[0];
    const values = lambdaName ? buildValuesForFactor(lambdaName) : [];
    return `[${values.join(', ')}]`;
  }

  // Not lambda: build array of arrays with comments
  const rowStrings = orderedFactorNames.map((factorName) => {
    const finalValues = buildValuesForFactor(factorName);
    return `[${finalValues.join(', ')}] // ${factorName}`;
  });

  return `[\n  ${rowStrings.join(',\n  ')}\n]`;
}

export function reorderReadoutStringArray(
  pool: LiquidityPool,
  readoutValuesAlphabetical: string[],
  addressSortOrder: string[],
  targetChain: Chain
): string[] {
  // 1. Build list of token infos (coinCode + address on target chain)
  const tokenInfos = pool.poolConstituents
    .map((pc) => {
      const addr = pc.coin.deploymentByChain.get(targetChain)?.address ?? '';
      return { code: pc.coin.coinCode, addr: addr.toLowerCase() };
    })
    .filter((t) => !!t.addr);

  // 2. Sort them by coin code so they align with readoutValuesAlphabetical
  const byCode = tokenInfos
    .slice()
    .sort((a, b) => a.code.localeCompare(b.code));

  // 3. Build a map: address -> readout value (from alphabetical list)
  const valueByAddress = new Map<string, string>();

  byCode.forEach((t, i) => {
    if (i < readoutValuesAlphabetical.length) {
      valueByAddress.set(t.addr, readoutValuesAlphabetical[i] ?? '');
    }
  });

  // 4. Produce result in addressSortOrder
  const result = addressSortOrder.map((addr) => {
    if (!addr) return '';
    const key = addr.toLowerCase();
    return valueByAddress.get(key) ?? '';
  });

  return result;
}
