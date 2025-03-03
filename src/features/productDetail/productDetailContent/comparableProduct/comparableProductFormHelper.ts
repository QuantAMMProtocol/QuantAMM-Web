import {
  GetPoolsSummaryQueryVariables,
  GqlChain,
  GqlPoolType,
} from '../../../../__generated__/graphql-types';

export const initialParams: GetPoolsSummaryQueryVariables = {
  first: 10,
  where: {
    minTvl: 10000,
  },
};

export const chains: { label: GqlChain; value: GqlChain }[] = [
  { label: GqlChain.Arbitrum, value: GqlChain.Arbitrum },
  { label: GqlChain.Avalanche, value: GqlChain.Avalanche },
  { label: GqlChain.Base, value: GqlChain.Base },
  { label: GqlChain.Fantom, value: GqlChain.Fantom },
  { label: GqlChain.Fraxtal, value: GqlChain.Fraxtal },
  { label: GqlChain.Gnosis, value: GqlChain.Gnosis },
  { label: GqlChain.Mainnet, value: GqlChain.Mainnet },
  { label: GqlChain.Mode, value: GqlChain.Mode },
  { label: GqlChain.Optimism, value: GqlChain.Optimism },
  { label: GqlChain.Polygon, value: GqlChain.Polygon },
  { label: GqlChain.Sepolia, value: GqlChain.Sepolia },
  { label: GqlChain.Sonic, value: GqlChain.Sonic },
  { label: GqlChain.Zkevm, value: GqlChain.Zkevm },
];

export const poolTypes: { label: GqlPoolType; value: GqlPoolType }[] = [
  { label: GqlPoolType.Stable, value: GqlPoolType.Stable },
  { label: GqlPoolType.Weighted, value: GqlPoolType.Weighted },
  {
    label: GqlPoolType.LiquidityBootstrapping,
    value: GqlPoolType.LiquidityBootstrapping,
  },
  { label: GqlPoolType.MetaStable, value: GqlPoolType.MetaStable },
  { label: GqlPoolType.PhantomStable, value: GqlPoolType.PhantomStable },
  { label: GqlPoolType.ComposableStable, value: GqlPoolType.ComposableStable },
  { label: GqlPoolType.CowAmm, value: GqlPoolType.CowAmm },
  { label: GqlPoolType.Element, value: GqlPoolType.Element },
  { label: GqlPoolType.Fx, value: GqlPoolType.Fx },
  { label: GqlPoolType.Gyro, value: GqlPoolType.Gyro },
];
