import { GqlPoolType } from '../__generated__/graphql-types';

export function isCowAmmPool(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.CowAmm;
}

export function isVebalPool(poolId: string): boolean {
  return (
    poolId.toLowerCase() ===
    '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014'
  );
}

export function isLiquidityBootstrapping(poolType: GqlPoolType): boolean {
  return poolType === GqlPoolType.LiquidityBootstrapping;
}

export function isLBP(poolType: GqlPoolType): boolean {
  return isLiquidityBootstrapping(poolType);
}
