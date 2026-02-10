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
        <Col span={8} className={styles.poolRuleCenterColumn}>
          <Row>
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
            <Col span={24} className={styles.sectionPaddingTop}>
              <Row hidden={localPoolType.mandatoryProperties.length === 0}>
                <Col span={24}>
                  <h5>
                    Choose pool strategy
                    <Tooltip title="Some balancer-v3 pool types can run various strategies, select a strategy to run on this dynamic AMM">
                      <InfoCircleOutlined className={styles.infoIcon} />
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
                    className={styles.fullWidthWithRightPadding}
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
                <Col span={24} className={styles.sectionPaddingTop}>
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
                    className={styles.arbGroupContainer}
                  >
                    <Radio.Group
                      onChange={(e) => setEnableArbBots(e.target.value)}
                      value={enableArbBots}
                      className={styles.arbBotsGroup}
                      size="small"
                    >
                      <Radio.Button disabled className={styles.arbBotsButton}>
                        Arbitrage Bots
                      </Radio.Button>
                      <Radio.Button value={true} className={styles.arbBotsButton}>
                        Automated
                      </Radio.Button>
                      <Radio.Button value={false} className={styles.arbBotsButton}>
                        None
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
              <Row>
                <div
                  className={styles.noParamsRequired}
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
                            className={styles.universalToggleGroup}
                            value={isUniversal}
                          >
                            <Radio.Button
                              value={true}
                              disabled
                              className={styles.universalToggleLabel}
                            >
                              Parameters applied to
                            </Radio.Button>
                            <Radio.Button
                              value={true}
                              className={styles.universalToggleOption}
                            >
                              All Tokens
                            </Radio.Button>
                            <Radio.Button
                              value={false}
                              className={styles.universalToggleOption}
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
            <Col span={24} className={styles.sectionPaddingTop}>
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
                className={styles.errorText}
              >
                Mandatory Pool Numeraire Required
              </p>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className={styles.continueSection}>
            <Col span={24}>
              <ConfiguredSimulationsToRunSummary />
              <Button
                disabled={
                  !coinDataLoaded ||
                  isRunLocked ||
                  simulationPools.length === 0
                }
                className={styles.continueButton}
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
                      <InfoCircleOutlined className={styles.infoIcon} />
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
