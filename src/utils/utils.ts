export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export const getBalancerPoolUrl = (chain: string, poolId: string): string => {
  if (chain === 'MAINNET') {
    return `https://balancer.fi/pools/ethereum/v3/${poolId}`;
  }
  else if(chain == 'SONIC'){
    return `https://beets.fi/pools/sonic/v3/${poolId}`
  }

  return `https://balancer.fi/pools/${chain.toLowerCase()}/v3/${poolId}`;
};

export const manualTruncate = (
  str: string,
  maxLength: number
): string => {
  if (str.length <= maxLength) {
    return str;
  }

  const truncated = str.slice(0, maxLength);

  return truncated + '...';
}
