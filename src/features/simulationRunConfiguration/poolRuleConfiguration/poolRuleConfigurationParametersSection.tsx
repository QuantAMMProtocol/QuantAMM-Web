import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tooltip } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import {
  LiquidityPoolCoin,
  PoolType,
  UpdateRule,
  UpdateRuleParameter,
} from '../simulationRunConfigModels';
import { UpdateRuleConfiguration } from './updateRuleConfiguration';
import { PoolRuleConfigurationUniversalToggle } from './poolRuleConfigurationUniversalToggle';
import styles from '../simulationRunConfiguration.module.css';

interface PoolRuleConfigurationParametersSectionProps {
  coinDataLoaded: boolean;
  runStatusIndex: number;
  localPoolType: PoolType;
  localUpdateRule: UpdateRule;
  availableUpdateRules: UpdateRule[];
  poolConstituents: LiquidityPoolCoin[];
  isUniversal: boolean;
  setLocalUpdateRule: Dispatch<SetStateAction<UpdateRule>>;
  setIsUniversal: Dispatch<SetStateAction<boolean>>;
  onUpdateRuleFactor: (
    updateRule: UpdateRuleParameter,
    e: number | string | null,
    applicableCoins: LiquidityPoolCoin[]
  ) => void;
}

export function PoolRuleConfigurationParametersSection({
  coinDataLoaded,
  runStatusIndex,
  localPoolType,
  localUpdateRule,
  availableUpdateRules,
  poolConstituents,
  isUniversal,
  setLocalUpdateRule,
  setIsUniversal,
  onUpdateRuleFactor,
}: PoolRuleConfigurationParametersSectionProps) {
  return (
    <Col span={24} hidden={localPoolType.mandatoryProperties.length === 0}>
      <Row>
        <Col span={24} className={styles.updateRuleParam}>
          <h5
            hidden={
              localPoolType.mandatoryProperties.length === 0 &&
              localUpdateRule.updateRuleParameters.length === 0
            }
          >
            Choose strategy parameters
            <Tooltip title="This dynamic AMM requires some fine tuning given some pool creation parameters. Parameters can often be global or specific to a given constituent.">
              <InfoCircleOutlined className={styles.infoIcon} />
            </Tooltip>
          </h5>
        </Col>
        <Col span={24}>
          <Space
            direction="vertical"
            size="middle"
            className={styles.updateRuleParamsSpace}
          >
            {localUpdateRule.updateRuleParameters.length > 0 && (
              <div>
                <PoolRuleConfigurationUniversalToggle
                  localUpdateRule={localUpdateRule}
                  availableUpdateRules={availableUpdateRules}
                  poolConstituents={poolConstituents}
                  isUniversal={isUniversal}
                  setLocalUpdateRule={setLocalUpdateRule}
                  setIsUniversal={setIsUniversal}
                />
                <UpdateRuleConfiguration
                  onUpdateRuleFactor={onUpdateRuleFactor}
                  updateRule={localUpdateRule}
                  coinDataLoaded={coinDataLoaded}
                  runStatusIndex={runStatusIndex}
                  isUniversal={isUniversal}
                />
              </div>
            )}
          </Space>
        </Col>
      </Row>
    </Col>
  );
}
