import { Button, Col, Menu, Row } from 'antd';
import { ControlOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { PriceGradientEstimation } from './updateRules/priceGradientEstimation';
import { CoVarianceEstimation } from './updateRules/covarianceEstimation';
import { PoolStructure } from './compositePools/poolStructure';
import { CompositePoolRebalancing } from './compositePools/compositePoolRebalancing';
import { WeightedSumsOfPools } from './compositePools/weightedSumsOfPools';
import { CompositePoolBenefits } from './compositePools/compositePoolBenefits';
import { MomentumUpdateRule } from './updateRules/momentumUpdateRule';
import { AntiMomentumUpdateRule } from './updateRules/antiMomentum';
import { PowerChannelUpdateRule } from './updateRules/powerChannelUpdateRule';
import { ChannelFollowingUpdateRule } from './updateRules/channelFollowing';
import { TruflationRegimeUpdateRule } from './updateRules/truflationRegimeUpdateRule';
import { MinVarianceUpdateRule } from './updateRules/minVarianceUpdateRule';
import { ImpermanentLoss } from './basics/impermanentLoss';
import LossVsRebalancing from './basics/lossVsRebalancing';
import CowammPoolDescription from './poolTypes/cowamm';
import GyroscopePoolDescription from './poolTypes/gyroscope';
import { QuantAMMPoolDescription } from './poolTypes/quantamm';
import { BalancerPoolDescription } from './poolTypes/balancer';
import AMMDescription from './basics/amm';
import RebalancingVsRebalancing from './basics/rebalancingvsRebalancing';
import { useParams } from 'react-router-dom';

const items = [
  {
    label: 'Fundamentals',
    key: 'Basics',
    children: [
      {
        label: 'Simulating Automated Market Makers',
        key: 'AutomatedMarketMakers',
      },
      {
        label: 'Impermanent Loss',
        key: 'ImpermanentLoss',
      },
      {
        label: 'Loss-Versus-Rebalancing (LVR)',
        key: 'LVR',
      },
      {
        label: 'Rebalancing-Versus-Rebalancing (RVR)',
        key: 'RVR',
      },
    ],
    icon: <SortAscendingOutlined />,
  },
  {
    label: 'QuantAMM Core Concepts',
    key: 'PoolTypes',
    children: [
      {
        label: 'Balancer Weighted',
        key: 'Balancer',
      },
      {
        label: 'QuantAMM: Introducing Time',
        key: 'QuantAMM',
      },
    ],
  },
  {
    label: 'QuantAMM Update Rules',
    key: 'UpdateRules',
    children: [
      {
        label: 'Momentum',
        key: 'SimpleMomentum',
      },
      {
        label: 'Channel Following',
        key: 'ChannelFollowing',
      },
      {
        label: 'AntiMomentum',
        key: 'AntiMomentum',
      },
      {
        label: 'Power Channel',
        key: 'PowerChannel',
      },
      {
        label: 'Min Variance',
        key: 'MinVariance',
      },
      {
        label: 'Truflation Inflation Regime',
        key: 'TruflationInflationRegime',
      },
      {
        label: 'Estimating Gradients',
        key: 'PriceGradientEstimation',
      },
      {
        label: 'Estimating Covariances',
        key: 'CoVarianceEstimation',
      },
    ],
    icon: <ControlOutlined />,
  },
];

const rootSubmenuKeys = ['Basics', 'PoolTypes', 'UpdateRules'];

const submenuKeys = [
  'AutomatedMarketMakers',
  'ImpermanentLoss',
  'LVR',
  'RVR',
  'QuantAMM',
  'CowAMM',
  'Gyroscope',
  'Balancer',
  'PriceGradientEstimation',
  'CoVarianceEstimation',
  'CompositePoolBenefits',
  'CompositePoolRebalancing',
  'PoolStructure',
  'WeightedSumsOfPools',
  'SimpleMomentum',
  'ChannelFollowing',
  'TruflationInflationRegime',
  'AntiMomentum',
  'PowerChannel',
  'MinVariance',
];

export default function Documentation() {
  const { id } = useParams();
  const [openKeys, setOpenKeys] = useState(rootSubmenuKeys);
  const [current, updateCurrent] = useState(id ? id : 'AutomatedMarketMakers');

  const onClick = (e: any) => {
    if (submenuKeys.indexOf(e.key) !== -1) {
      updateCurrent(e.key);
    }
  };
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (latestOpenKey) {
      setOpenKeys([...openKeys, latestOpenKey]);
    } else {
      setOpenKeys(keys);
    }
  };

  const components: Record<string, JSX.Element> = {
    PriceGradientEstimation: <PriceGradientEstimation />,
    CoVarianceEstimation: <CoVarianceEstimation />,
    CompositePoolBenefits: <CompositePoolBenefits />,
    CompositePoolRebalancing: <CompositePoolRebalancing />,
    PoolStructure: <PoolStructure />,
    WeightedSumsOfPools: <WeightedSumsOfPools />,
    SimpleMomentum: <MomentumUpdateRule />,
    ChannelFollowing: <ChannelFollowingUpdateRule />,
    AntiMomentum: <AntiMomentumUpdateRule />,
    PowerChannel: <PowerChannelUpdateRule />,
    TruflationInflationRegime: <TruflationRegimeUpdateRule />,
    MinVariance: <MinVarianceUpdateRule />,
    ImpermanentLoss: <ImpermanentLoss />,
    LVR: <LossVsRebalancing />,
    RVR: <RebalancingVsRebalancing />,
    CowAMM: <CowammPoolDescription />,
    Gyroscope: <GyroscopePoolDescription />,
    QuantAMM: <QuantAMMPoolDescription />,
    Balancer: <BalancerPoolDescription />,
    AutomatedMarketMakers: <AMMDescription />,
  };

  return (
    <div>
      <Row>
        <Col span={6} style={{ maxHeight: '95vh', overflowY: 'auto' }}>
          <Button
            onClick={() =>
              window.open(
                'https://quantammsim.readthedocs.io/',
                '_blank'
              )
            }
            style={{ marginTop: '15px', marginBottom: '15px', width: '80%', margin:'10px'  }}
          >
            Open Simulator Technical Code Docs
          </Button>
          <Button
            onClick={() =>
              window.open(
                'https://quantamm.gitbook.io/quantamm-protocol/',
                '_blank'
              )
            }
            style={{ marginTop: '15px', marginBottom: '15px', width: '80%', margin:'10px' }}
          >
            Open Protocol Contracts GitBook
          </Button>
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={onClick}
            items={items}
            activeKey={current}
            defaultValue={current}
          />
        </Col>
        <Col span={18} style={{ paddingBottom: 40 }}>
          {components[current]}
        </Col>
      </Row>
    </div>
  );
}

export { Documentation };
