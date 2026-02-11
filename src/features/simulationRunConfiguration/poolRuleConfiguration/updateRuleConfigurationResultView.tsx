import { Col, InputNumber, Row, Space } from 'antd';
import {
  LiquidityPool,
  UpdateRuleParameter,
} from '../simulationRunConfigModels';
import styles from '../simulationRunConfiguration.module.css';
import { GroupedParameters } from './updateRuleConfiguration';

const toNumericValue = (value: string | number | null | undefined) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

const getGroupedParameters = (pool: LiquidityPool): GroupedParameters =>
  pool.updateRule.updateRuleParameters.reduce(
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

interface UpdateRuleConfigurationResultViewProps {
  pool: LiquidityPool;
}

export function UpdateRuleConfigurationResultView({
  pool,
}: UpdateRuleConfigurationResultViewProps) {
  const groupedParameters = getGroupedParameters(pool);

  return (
    <Space direction="vertical" align="start" className={styles.summarySpace}>
      <Row>
        <Col span={8}>
          <Col span={24}>
            <p>{pool.poolConstituents.map((token) => token.coin.coinCode).join('-')}</p>
          </Col>
          <Col span={24}>
            <p>{pool.updateRule.updateRuleName}</p>
          </Col>
          <Col span={24}></Col>
        </Col>
        <Col span={16} className={styles.summaryRuleColumn}>
          <Row>
            <Col span={24}>
              <span>Automatic Arb Bots:</span>
              <span>{pool.enableAutomaticArbBots ? '  Enabled' : '  Disabled'}</span>
            </Col>
          </Row>
          {Object.keys(groupedParameters).length === 0 && (
            <Col span={24} className={styles.summaryNoParams}>
              No dynamic default parameters
            </Col>
          )}
          {Object.entries(groupedParameters).map(([coinCode, items]) => (
            <div key={coinCode} className={styles.summaryParameterGroup}>
              {items[0].coin && (
                <Row>
                  <Col span={24}>
                    <h5 className={styles.summaryParameterTitle}>
                      {items[0].coin.coin.coinName}
                    </h5>
                  </Col>
                </Row>
              )}
              <Row gutter={[16, 16]}>
                {items.map(({ param }, index) => (
                  <Col key={`${param.factorName}-${coinCode}-${index}`} span={24}>
                    <InputNumber
                      disabled
                      id={`${param.factorName}-${coinCode}-${index}`}
                      addonBefore={param.factorName}
                      value={toNumericValue(
                        items[index].coin?.factorValue ?? param.factorValue
                      )}
                      className={styles.summaryInput}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Col>
      </Row>
    </Space>
  );
}
