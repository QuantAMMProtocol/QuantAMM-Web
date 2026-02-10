//TODO CH split into subcomponents
import {
  Select,
  Row,
  Col,
  Button,
  InputNumber,
  Space,
  Radio,
  Tooltip,
} from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  changeSimulationRunnerCurrentStepIndex,
  selectSimulationRunStatusStepIndex,
} from '../simulationRunner/simulationRunnerSlice';
import styles from './simulationRunConfiguration.module.css';
import {
  selectCoinPriceDataLoaded,
  selectAvailableUpdateRules,
  selectPoolConstituents,
  generateAndAddPoolToSim,
  selectAvailablePoolTypes,
  selectPoolType,
  setPoolCoinNumeraire,
  selectPoolNumeraire,
  selectSimulationPools,
} from './simulationRunConfigurationSlice';
import {
  LiquidityPoolCoin,
  PoolType,
  UpdateRule,
  UpdateRuleParameter,
} from './simulationRunConfigModels';
import { LiquidityPoolConfiguration } from './liquidityPoolConfiguration';
import { ConfiguredSimulationsToRunSummary } from './configuredSimulationsToRunSummary';

const { Option } = Select;

interface updateRuleFactorParams {
  handleUpdateRuleFactor: (
    updateRule: UpdateRuleParameter,
    e: number | string | null,
    _applicableCoins: LiquidityPoolCoin[]
  ) => void;
  isUniversal: boolean;
  updateRule: UpdateRule;
  coinDataLoaded: boolean;
  runStatusIndex: number;
}

const getDefaultUpdateRuleForPoolType = (
  poolTypeName: string,
  availableUpdateRules: UpdateRule[]
): UpdateRule | undefined => {
  if (poolTypeName === 'QuantAMM') {
    return availableUpdateRules.find((x) => x.updateRuleName === 'Momentum');
  }
  return availableUpdateRules.find((x) =>
    x.applicablePoolTypes.some((poolType) => poolType === poolTypeName)
  );
};

const toNumericValue = (
  value: string | number | null | undefined
): number | undefined => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

export function PoolRuleConfiguration() {
  const availableUpdateRules = useAppSelector(selectAvailableUpdateRules);
  const availablePoolTypes = useAppSelector(selectAvailablePoolTypes);
  const poolType = useAppSelector(selectPoolType);
  const poolConstituents = useAppSelector(selectPoolConstituents);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const runStatusIndex = useAppSelector(selectSimulationRunStatusStepIndex);
  const poolNumeraire = useAppSelector(selectPoolNumeraire);
  const simulationPools = useAppSelector(selectSimulationPools);
  const dispatch = useAppDispatch();

  const currentInitialRule =
    getDefaultUpdateRuleForPoolType(poolType.name, availableUpdateRules) ??
    availableUpdateRules.find((rule) => rule.updateRuleName === 'HODL') ??
    availableUpdateRules[0];

  const currentInitialPoolType =
    availablePoolTypes.find((type) => type.name === poolType.name) ??
    availablePoolTypes[0];

  const [localUpdateRule, setLocalUpdateRule] =
    useState<UpdateRule>(currentInitialRule);

  const [localPoolType, setLocalPoolType] = useState<PoolType>(
    currentInitialPoolType
  );
  const [enableArbBots, setEnableArbBots] = useState(true);

  const [isUniversal, setIsUniversal] = useState(true);
  const isRunLocked = runStatusIndex === 2;

  function handleUpdateRuleFactor(
    updateRuleParam: UpdateRuleParameter,
    e: number | string | null,
    applicableCoins: LiquidityPoolCoin[]
  ) {
    const newValue = `${e ?? 0}`;

    setLocalUpdateRule((prevRule) => {
      const updatedParameters = prevRule.updateRuleParameters.map((param) => {
        if (param.factorName === updateRuleParam.factorName) {
          if (isUniversal) {
            return {
              ...param,
              factorValue: newValue,
              applicableCoins: [],
            };
          }

          const updatedApplicableCoins = param.applicableCoins.map((coin) => {
            if (
              applicableCoins.some(
                (ac) => ac.coin.coinCode === coin.coin.coinCode
              )
            ) {
              return {
                ...coin,
                factorValue: newValue,
              };
            }
            return coin;
          });

          return {
            ...param,
            applicableCoins: updatedApplicableCoins,
          };
        }
        return param;
      });

      return {
        ...prevRule,
        updateRuleParameters: updatedParameters,
      };
    });
  }

  return (
    <div>
      <Row>
        <Col span={8}>
          <LiquidityPoolConfiguration />
        </Col>
        <Col span={8} style={{ paddingLeft: 40, paddingRight: 40 }}>
          <Row>
            <Col span={24}>
              <Col span={24}>
                <h5>
                  Choose pool type
                  <Tooltip title="Balancer-v3 can run multiple AMM types, select and configure which AMM types you would like to simulate">
                    <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                  </Tooltip>
                </h5>
              </Col>
              <Col span={24}>
                <Select
                  disabled={!coinDataLoaded || isRunLocked}
                  placeholder="Add pool to simulation"
                  style={{ width: '100%' }}
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

            <Col span={24} style={{ paddingTop: '10px' }}>
              <div hidden={!localPoolType.requiresPoolNumeraire}>
                <Select
                  style={{
                    width: '100%',
                    marginBottom: '5px',
                    paddingRight: '3px',
                  }}
                  placeholder="Select pool coin numeraire"
                  disabled={!coinDataLoaded || isRunLocked}
                  onChange={(value: string) => {
                    dispatch(setPoolCoinNumeraire(value));
                  }}
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
            <Col span={24} style={{ paddingTop: '10px' }}>
              <Row hidden={localPoolType.mandatoryProperties.length === 0}>
                <Col span={24}>
                  <h5>
                    Choose pool strategy
                    <Tooltip title="Some balancer-v3 pool types can run various strategies, select a strategy to run on this dynamic AMM">
                      <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                    </Tooltip>
                  </h5>
                </Col>
                <Col span={24}>
                  <Select
                    disabled={
                      !coinDataLoaded ||
                      isRunLocked ||
                      localPoolType.mandatoryProperties.length === 0
                    }
                    placeholder="Select an update rule"
                    style={{ width: '100%', paddingRight: '3px' }}
                    value={localUpdateRule.updateRuleName}
                    onSelect={(ruleName) => {
                      const foundRule = availableUpdateRules.find(
                        (x) => x.updateRuleName === ruleName
                      );

                      if (foundRule) {
                        setLocalUpdateRule(foundRule);
                      }
                    }}
                  >
                    {availableUpdateRules
                      .filter(
                        (x) =>
                          x.applicablePoolTypes?.some(
                            (y) => y === localPoolType.name
                          ) ?? false
                      )
                      .map((x) => (
                        <Option key={x.updateRuleName} value={x.updateRuleName}>
                          {x.updateRuleName}
                        </Option>
                      ))}
                  </Select>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ paddingTop: '10px' }}>
                  <div
                    hidden={
                      localUpdateRule.updateRuleName
                        .toLowerCase()
                        .includes('hodl') ||
                      localUpdateRule.updateRuleName
                        .toLowerCase()
                        .includes('lvr') ||
                      localUpdateRule.updateRuleName
                        .toLowerCase()
                        .includes('rvr')
                    }
                    style={{ width: '100%' }}
                  >
                    <Radio.Group
                      onChange={(e) => setEnableArbBots(e.target.value)}
                      value={enableArbBots}
                      style={{ width: '100%' }}
                      size="small"
                    >
                      <Radio.Button
                        disabled
                        style={{ width: '33%', textAlign: 'center' }}
                      >
                        Arbitrage Bots
                      </Radio.Button>
                      <Radio.Button
                        value={true}
                        style={{ width: '33%', textAlign: 'center' }}
                      >
                        Automated
                      </Radio.Button>
                      <Radio.Button
                        value={false}
                        style={{ width: '33%', textAlign: 'center' }}
                      >
                        None
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
              <Row>
                <div
                  style={{ paddingTop: '10px' }}
                  hidden={
                    localPoolType.mandatoryProperties.length > 0 ||
                    localUpdateRule.updateRuleParameters.length > 0
                  }
                >
                  No Parameters Required
                </div>
              </Row>
            </Col>
            <Col
              span={24}
              hidden={localPoolType.mandatoryProperties.length === 0}
            >
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
                      <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                    </Tooltip>
                  </h5>
                </Col>
                <Col span={24}>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{
                      display: 'flex',
                    }}
                  >
                    {localUpdateRule.updateRuleParameters.length > 0 && (
                      <div>
                        <div
                          id="UniversalToggle"
                          hidden={
                            localUpdateRule.updateRuleName
                              .toLowerCase()
                              .indexOf('cowamm') !== -1 ||
                            localUpdateRule.updateRuleName
                              .toLowerCase()
                              .indexOf('gyro') !== -1
                          }
                        >
                          <Radio.Group
                            onChange={(e) => {
                              const nextIsUniversal = e.target.value;

                              if (!nextIsUniversal) {
                                setLocalUpdateRule((prevRule) => ({
                                  ...prevRule,
                                  updateRuleParameters:
                                    prevRule.updateRuleParameters.map(
                                      (param) => ({
                                        ...param,
                                        applicableCoins: poolConstituents.map(
                                          (token) => ({
                                            coin: token.coin,
                                            weight: token.weight,
                                            currentPrice: token.currentPrice,
                                            currentPriceUnix:
                                              token.currentPriceUnix,
                                            amount: token.amount,
                                            marketValue: token.marketValue,
                                            factorValue: param.factorValue,
                                          })
                                        ),
                                      })
                                    ),
                                }));
                              } else {
                                const foundRule = availableUpdateRules.find(
                                  (x) =>
                                    x.updateRuleName ===
                                    localUpdateRule.updateRuleName
                                );

                                if (foundRule) {
                                  setLocalUpdateRule((prevRule) => ({
                                    ...prevRule,
                                    updateRuleParameters:
                                      foundRule.updateRuleParameters.map(
                                        (param) => ({
                                          ...param,
                                          applicableCoins: [],
                                        })
                                      ),
                                  }));
                                }
                              }
                              setIsUniversal(nextIsUniversal);
                            }}
                            size="small"
                            style={{ width: '100%', textAlign: 'center' }}
                            value={isUniversal}
                          >
                            <Radio.Button
                              value={true}
                              disabled
                              style={{ width: '50%' }}
                            >
                              Parameters applied to
                            </Radio.Button>
                            <Radio.Button value={true} style={{ width: '25%' }}>
                              All Tokens
                            </Radio.Button>
                            <Radio.Button
                              value={false}
                              style={{ width: '25%' }}
                            >
                              Per Token
                            </Radio.Button>
                          </Radio.Group>
                        </div>
                        <UpdateRuleConfiguration
                          handleUpdateRuleFactor={handleUpdateRuleFactor}
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
          </Row>
          <Row>
            <Col span={24} style={{ paddingTop: '10px' }}>
              <Button
                disabled={
                  !coinDataLoaded ||
                  isRunLocked ||
                  (localPoolType.requiresPoolNumeraire && poolNumeraire === '')
                }
                type="primary"
                onClick={() => {
                  dispatch(
                    generateAndAddPoolToSim({
                      updateRule: localUpdateRule,
                      poolConstituents,
                      poolType: localPoolType,

                      id: '',
                      enableAutomaticArbBots: enableArbBots,
                    })
                  );
                }}
              >
                {isRunLocked ? 'Reset Sim' : 'Add pool to simulator'}
              </Button>
              <p
                hidden={
                  !(localPoolType.requiresPoolNumeraire && poolNumeraire === '')
                }
                style={{ color: 'red' }}
              >
                Mandatory Pool Numeraire Required
              </p>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row style={{ paddingTop: '10px' }}>
            <Col span={24}>
              <ConfiguredSimulationsToRunSummary />
              <Button
                disabled={
                  !coinDataLoaded ||
                  isRunLocked ||
                  simulationPools.length === 0
                }
                style={{ backgroundColor: 'green', float: 'right' }}
                onClick={() => {
                  dispatch(changeSimulationRunnerCurrentStepIndex(2));
                }}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export type GroupedParameters = Record<
  string,
  { param: UpdateRuleParameter; coin?: LiquidityPoolCoin }[]
>;

const UpdateRuleConfiguration = ({
  handleUpdateRuleFactor,
  isUniversal,
  updateRule,
  coinDataLoaded,
  runStatusIndex,
}: updateRuleFactorParams) => {
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
      style={{
        paddingTop: '16px',
        paddingLeft: '8px',
        display: 'flex',
      }}
    >
      {Object.entries(groupedParameters).map(([coinCode, items]) => (
        <div key={coinCode} style={{ width: '100%' }}>
          {items[0].coin && (
            <Row>
              <Col span={24}>
                <h5
                  style={{
                    marginBottom: 8,
                  }}
                >
                  {items[0].coin.coin.coinCode}
                </h5>
              </Col>
            </Row>
          )}
          <Row gutter={[16, 16]}>
            {items.map(({ param }, index) => (
              <InputNumber
                style={{ width: '100%', paddingRight: '8px' }}
                size="small"
                disabled={!coinDataLoaded || runStatusIndex === 2}
                key={`${param.factorName}-${coinCode}-${index}`}
                id={`${param.factorName}-${coinCode}-${index}`}
                value={
                  toNumericValue(
                    isUniversal
                      ? param.factorValue
                      : items[index].coin?.factorValue ?? param.factorValue
                  )
                }
                addonBefore={
                  <div>
                    {param.factorDisplayName}
                    <Tooltip title={param.factorDescription}>
                      <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                    </Tooltip>
                  </div>
                }
                addonAfter={`${param.minValue} < x < ${param.maxValue}`}
                min={toNumericValue(param.minValue)}
                max={toNumericValue(param.maxValue)}
                step={0.0001}
                onChange={(e) => {
                  const selectedCoin =
                    items[index].coin ?? param.applicableCoins[index];
                  const coins =
                    isUniversal || !selectedCoin ? [] : [selectedCoin];

                  handleUpdateRuleFactor(param, e, coins);
                }}
              />
            ))}
          </Row>
        </div>
      ))}
    </Space>
  );
};
