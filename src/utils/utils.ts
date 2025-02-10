export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export const getBalancerPoolUrl = (chain: string, poolId: string): string => {
  console.log('chain ', chain);
  if (chain === 'MAINNET') {
    return `https://balancer.fi/pools/ethereum/v3/${poolId}`;
  }

  return `https://balancer.fi/pools/${chain.toLowerCase()}/v3/${poolId}`;
};
