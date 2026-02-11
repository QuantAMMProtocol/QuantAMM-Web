import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Select, Tooltip } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import {
  LiquidityPoolCoin,
  PoolType,
  UpdateRule,
} from './simulationRunConfigModels';
import { getDefaultUpdateRuleForPoolType } from './poolRuleConfigurationUtils';
import styles from './simulationRunConfiguration.module.css';

const { Option } = Select;

interface PoolRuleConfigurationTypeSectionProps {
  coinDataLoaded: boolean;
  isRunLocked: boolean;
  localPoolType: PoolType;
  availablePoolTypes: PoolType[];
  availableUpdateRules: UpdateRule[];
  poolConstituents: LiquidityPoolCoin[];
  poolNumeraire: string;
  setLocalPoolType: Dispatch<SetStateAction<PoolType>>;
  setLocalUpdateRule: Dispatch<SetStateAction<UpdateRule>>;
  onPoolNumeraireChange: (value: string) => void;
}

export function PoolRuleConfigurationTypeSection({
  coinDataLoaded,
  isRunLocked,
  localPoolType,
  availablePoolTypes,
  availableUpdateRules,
  poolConstituents,
  poolNumeraire,
  setLocalPoolType,
  setLocalUpdateRule,
  onPoolNumeraireChange,
}: PoolRuleConfigurationTypeSectionProps) {
  return (
    <>
      <Col span={24}>
        <Col span={24}>
          <h5>
            Choose pool type
            <Tooltip title="Balancer-v3 can run multiple AMM types, select and configure which AMM types you would like to simulate">
              <InfoCircleOutlined className={styles.infoIcon} />
            </Tooltip>
          </h5>
        </Col>
        <Col span={24}>
          <Select
            disabled={!coinDataLoaded || isRunLocked}
            placeholder="Add pool to simulation"
            className={styles.fullWidth}
            value={localPoolType.name}
            onSelect={(poolTypeName) => {
              const foundType = availablePoolTypes.find(
                (x) => x.name === poolTypeName
              );

              if (foundType) {
                setLocalPoolType(foundType);
              }

              const foundRule = getDefaultUpdateRuleForPoolType(
                poolTypeName,
                availableUpdateRules
              );

              if (foundRule) {
                setLocalUpdateRule(foundRule);
              }
            }}
          >
            {(poolConstituents.length > 2
              ? availablePoolTypes.filter(
                  (x) =>
                    !x.name.toLowerCase().includes('cow') &&
                    !x.name.toLowerCase().includes('gyroscope')
                )
              : availablePoolTypes
            ).map((x) => (
              <Option key={x.name} value={x.name}>
                {x.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Col>
      <Col span={24} className={styles.sectionPaddingTop}>
        <div hidden={!localPoolType.requiresPoolNumeraire}>
          <Select
            className={styles.numeraireSelect}
            placeholder="Select pool coin numeraire"
            disabled={!coinDataLoaded || isRunLocked}
            onChange={onPoolNumeraireChange}
            value={poolNumeraire || undefined}
          >
            {poolConstituents.map((constituent) => (
              <Option
                key={constituent.coin.coinCode}
                value={constituent.coin.coinCode}
              >
                {constituent.coin.coinCode}
              </Option>
            ))}
          </Select>
        </div>
      </Col>
    </>
  );
}
