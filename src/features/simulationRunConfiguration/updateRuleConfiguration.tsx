import { Col, InputNumber, Row, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './simulationRunConfiguration.module.css';
import {
  LiquidityPoolCoin,
  UpdateRule,
  UpdateRuleParameter,
} from './simulationRunConfigModels';

export type GroupedParameters = Record<
  string,
  { param: UpdateRuleParameter; coin?: LiquidityPoolCoin }[]
>;

export interface UpdateRuleFactorParams {
  onUpdateRuleFactor: (
    updateRule: UpdateRuleParameter,
    e: number | string | null,
    _applicableCoins: LiquidityPoolCoin[]
  ) => void;
  isUniversal: boolean;
  updateRule: UpdateRule;
  coinDataLoaded: boolean;
  runStatusIndex: number;
}

const toNumericValue = (
  value: string | number | null | undefined
): number | undefined => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

export function UpdateRuleConfiguration({
  onUpdateRuleFactor,
  isUniversal,
  updateRule,
  coinDataLoaded,
  runStatusIndex,
}: UpdateRuleFactorParams) {
  const groupedParameters = updateRule.updateRuleParameters.reduce(
    (acc: GroupedParameters, param: UpdateRuleParameter) => {
      if (param.applicableCoins && param.applicableCoins.length > 0) {
        param.applicableCoins.forEach((coin) => {
          if (!acc[coin.coin.coinCode]) {
            acc[coin.coin.coinCode] = [];
          }
          acc[coin.coin.coinCode].push({ param, coin });
        });
      } else {
        if (!acc.noCoins) {
          acc.noCoins = [];
        }
        acc.noCoins.push({ param });
      }
      return acc;
    },
    {}
  );

  return (
    <Space
      direction="vertical"
      size="middle"
      className={styles.updateRuleConfigContainer}
    >
      {Object.entries(groupedParameters).map(([coinCode, items]) => (
        <div key={coinCode} className={styles.groupParameterSection}>
          {items[0].coin && (
            <Row>
              <Col span={24}>
                <h5 className={styles.groupParameterTitle}>
                  {items[0].coin.coin.coinCode}
                </h5>
              </Col>
            </Row>
          )}
          <Row gutter={[16, 16]}>
            {items.map(({ param }, index) => (
              <InputNumber
                className={styles.inputWithRightPadding}
                size="small"
                disabled={!coinDataLoaded || runStatusIndex === 2}
                key={`${param.factorName}-${coinCode}-${index}`}
                id={`${param.factorName}-${coinCode}-${index}`}
                value={toNumericValue(
                  isUniversal
                    ? param.factorValue
                    : items[index].coin?.factorValue ?? param.factorValue
                )}
                addonBefore={
                  <div>
                    {param.factorDisplayName}
                    <Tooltip title={param.factorDescription}>
                      <InfoCircleOutlined className={styles.infoIcon} />
                    </Tooltip>
                  </div>
                }
                addonAfter={`${param.minValue} < x < ${param.maxValue}`}
                min={toNumericValue(param.minValue)}
                max={toNumericValue(param.maxValue)}
                step={0.0001}
                onChange={(e) => {
                  const selectedCoin = items[index].coin ?? param.applicableCoins[index];
                  const coins = isUniversal || !selectedCoin ? [] : [selectedCoin];
                  onUpdateRuleFactor(param, e, coins);
                }}
              />
            ))}
          </Row>
        </div>
      ))}
    </Space>
  );
}
