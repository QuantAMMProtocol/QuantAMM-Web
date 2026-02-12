import { useMemo } from 'react';

interface DepositorBadges {
  prefix: string;
  gold: number;
  silver: number;
  bronze: number;
}

interface LivePoolsShape {
  factsheets: { poolId: string; depositorBadges: DepositorBadges }[];
}

export function useBadgeThresholds(
  productAddress: string,
  livePools: LivePoolsShape
) {
  return useMemo(() => {
    let gold = 0,
      silver = 0,
      bronze = 0,
      prefix = 'UNKNOWN';
    const depos = livePools.factsheets.find(
      (y) => y.poolId === productAddress
    )?.depositorBadges;
    if (productAddress && depos) {
      prefix = depos.prefix;
      gold = depos.gold;
      silver = depos.silver;
      bronze = depos.bronze;
    }
    return {
      goldThreshold: gold,
      silverThreshold: silver,
      bronzeThreshold: bronze,
      srcPrefix: prefix,
    };
  }, [livePools.factsheets, productAddress]);
}
