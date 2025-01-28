import { FC } from 'react';
import { Strategy } from '../../../models';
import { Momentum } from './momentum';
import { AntiMomentum } from './antiMomentum';
import { ChannelFollowing } from './channelFollowing';
import { PowerChannel } from './powerChannel';
import { MinVariance } from './minVariance';

const mapStrategyToContent = (strategy: Strategy): JSX.Element => {
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
  }
};

interface Eli5Props {
  strategy: Strategy;
}

export const Eli5: FC<Eli5Props> = ({ strategy }) => {
  return mapStrategyToContent(strategy);
};
