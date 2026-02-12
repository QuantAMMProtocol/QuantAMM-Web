import { Button, Col, Divider, InputNumber, Row, Space } from 'antd';
import {
  LiquidityPool,
  UpdateRuleParameter,
} from '../../simulationRunConfiguration/simulationRunConfigModels';
import { GroupedParameters } from '../../simulationRunConfiguration/poolRuleConfiguration/updateRuleConfiguration';
import runnerStyles from '../simulationRunnerCommon.module.css';

const getGroupedParameters = (pool: LiquidityPool): GroupedParameters =>
  pool.updateRule.updateRuleParameters.reduce(
    (acc: GroupedParameters, param: UpdateRuleParameter) => {
      if (param.applicableCoins && param.applicableCoins.length > 0) {
        param.applicableCoins.forEach((coin) => {
          if (!acc[coin.coin.coinCode]) {
            acc[coin.coin.coinCode] = [];
          }
          acc[coin.coin.coinCode].push({
            param,
            coin,
          });
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

interface PoolSummaryProps {
  updateRuleName: string;
  pool: LiquidityPool;
  coinDataLoaded: boolean;
  runStatusIndex: number;
  onRemovePool: (poolId: string) => void;
}

export function SimulationRunnerPoolSummary({
  updateRuleName,
  pool,
  coinDataLoaded,
  runStatusIndex,
  onRemovePool,
}: PoolSummaryProps) {
  const groupedParameters = getGroupedParameters(pool);

  return (
    <div key={pool.id}>
      <Row>
        <Col span={4}>{updateRuleName}</Col>
        <Col span={16}>
          <Row>
            <Space
              direction="vertical"
              align="start"
              className={`${runnerStyles.fullWidth} ${runnerStyles.spaceAround}`}
            >
              {Object.entries(groupedParameters).map(([coinCode, items]) => (
                <div key={coinCode} className={runnerStyles.fullWidth}>
                  {items[0].coin && (
                    <Row>
                      <Col span={24}>
                        <h5 className={runnerStyles.marginBottom8}>
                          {items[0].coin.coin.coinName}
                        </h5>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={[16, 16]}>
                    {items.map(({ param }, index) => (
                      <Col
                        key={`${param.factorName}-${coinCode}-${index}`}
                        span={10}
                      >
                        <InputNumber
                          disabled
                          id={`${param.factorName}-${coinCode}-${index}`}
                          addonBefore={param.factorName}
                          value={
                            (param.applicableCoins?.length ?? 0) > 0
                              ? items[index]?.coin?.factorValue ??
                                param.factorValue
                              : param.factorValue
                          }
                          className={runnerStyles.fullWidth}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Space>
          </Row>
        </Col>
        <Col span={4}>
          <div className={runnerStyles.padding5}>
            <Space direction="vertical" className={runnerStyles.fullWidth}>
              <Button
                disabled={!coinDataLoaded || runStatusIndex === 2}
                type="primary"
                onClick={() => {
                  onRemovePool(pool.id);
                }}
              >
                Remove
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
      <Divider></Divider>
    </div>
  );
}
