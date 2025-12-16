import { FC } from 'react';
import { Momentum } from './momentum';
import { AntiMomentum } from './antiMomentum';
import { ChannelFollowing } from './channelFollowing';
import { PowerChannel } from './powerChannel';
import { MinVariance } from './minVariance';
import { Weighted } from './weighted';
import { ComposabeStable } from './composableStable';
import { ElementPool } from './element';
import { FX } from './fx';
import { Gyro } from './gyro';
import { LiquidityBoostrap } from './liquidityBootstrapping';
import { TruflationInflationRegime } from './truflationInflationRegime';

const mapStrategyToContent = (strategy: string): JSX.Element => {
  switch (strategy) {
    case 'ANTI_MOMENTUM':
      return <AntiMomentum />;
    case 'CHANNEL_FOLLOWING':
      return <ChannelFollowing />;
    case 'POWER_CHANNEL':
      return <PowerChannel />;
    case 'MIN_VARIANCE':
      return <MinVariance />;
    case 'MOMENTUM':
      return <Momentum />;
    case 'WEIGHTED':
      return <Weighted />;
    case 'COMPOSABLE_STABLE':
      return <ComposabeStable />;
    case 'ELEMENT':
      return <ElementPool />;
    case 'FX':
      return <FX />;
    case 'GYRO':
      return <Gyro />;
    case 'GYRO3':
      return <Gyro />;
    case 'GYROE':
      return <Gyro />;
    case 'LIQUIDITY_BOOTSTRAPPING':
      return <LiquidityBoostrap />;
    case 'TRUFLATION_INFLATION_REGIME':
      return <TruflationInflationRegime />;
  }

  return <div>No description found</div>;
};

interface Eli5Props {
  strategy: string;
}

export const Eli5: FC<Eli5Props> = ({ strategy }) => {
  return mapStrategyToContent(strategy);
};
