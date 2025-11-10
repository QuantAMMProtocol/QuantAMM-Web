import { useMemo } from 'react';
import { GqlChain } from '../../../__generated__/graphql-types';

export function useExplorerBase(chain: GqlChain): string {
  return useMemo(() => {
    const roots: Record<string, string> = {
      MAINNET: 'https://etherscan.io',
      BASE: 'https://basescan.org',
      ARBITRUM: 'https://arbiscan.io',
      SONIC: 'https://sonicscan.org',
    };
    return roots[String(chain).toUpperCase()] ?? 'https://etherscan.io';
  }, [chain]);
}
