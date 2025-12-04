import styles from '../simulationResults/simulationResultSummary.module.css';

import {
  Chain,
  DeployedToken,
  LiquidityPool,
  UpdateRuleParameter,
} from '../simulationRunConfiguration/simulationRunConfigModels';

import {
  Checkbox,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';

const { Text } = Typography;

export interface PoolDeploymentConfigReviewProps {
  pool: LiquidityPool;
}

// Front-end representation of the Hardhat QuantAMMDeploymentInputParams
// This keeps only the generic fields – per-token addresses/oracles are handled dynamically
// from the pool constituents + deployment metadata.
interface LocalQuantAMMDeploymentInputParams {
  Vault: string;
  PauseWindowDuration: number | null;
  UpdateWeightRunner: string;
  FactoryVersion: string;
  PoolVersion: string;
}

interface LocalTokenConfig {
  id: string;
  displayName: string;
  token: string;
  rateProvider: string;
  tokenType: number | null;
}

interface LocalPoolSettings {
  assets: string;
  rule: string;
  updateInterval: number | null;
  lambda: string;
  epsilonMax: string;
  absoluteWeightGuardRail: string;
  maxTradeSizeRatio: string;
  ruleParameters: string;
  poolManager: string;
}

interface LocalCreationNewPoolParams {
  name: string;
  symbol: string;
  normalizedWeights: string;
  swapFeePercentage: string;
  poolHooksContract: string;
  enableDonation: boolean;
  disableUnbalancedLiquidity: boolean;
  salt: string;
  initialWeights: string;
  poolSettings: LocalPoolSettings;
  initialMovingAverages: string;
  initialIntermediateValues: string;
  oracleStalenessThreshold: string;
  poolRegistry: string;
  poolDetails: string;
}

function getDeploymentForChain(
  coinDeploymentByChain: Map<string, DeployedToken> | undefined,
  targetChain: string
): DeployedToken | undefined {
  if (!coinDeploymentByChain || !targetChain) {
    return undefined;
  }

  try {
    return coinDeploymentByChain.get(targetChain);
  } catch {
    return undefined;
  }
}

/**
 * Build a ruleParameters string (for input.ts) from the pool's update rule parameters.
 * Rows are ordered by smartContractSortOrder and each row is ordered by pool token order.
 * Each row is rendered as: [v1, v2, ...] // factorName
 */
function buildRuleParametersString(pool: LiquidityPool): string {
  const tokenCodes = pool.poolConstituents.map((c) => c.coin.coinCode);
  const params: UpdateRuleParameter[] = pool.updateRule.updateRuleParameters;

  interface Row {
    factorName: string;
    valuesByCoin: Record<string, string>;
  }

  const rowsByOrder: Record<number, Row> = {};

  params.forEach((param) => {
    const sortOrder = param.smartContractSortOrder ?? 0;

    const existingRow = rowsByOrder[sortOrder];
    const row: Row = existingRow ?? {
      factorName: param.factorName,
      valuesByCoin: {},
    };

    if (param.applicableCoins && param.applicableCoins.length > 0) {
      // Coin-specific overrides
      param.applicableCoins.forEach((liquidityPoolCoin) => {
        const coinCode = liquidityPoolCoin.coin.coinCode;
        const value = liquidityPoolCoin.factorValue ?? param.factorValue;
        row.valuesByCoin[coinCode] = value;
      });
    } else {
      // Applies to all coins – fill any missing values
      tokenCodes.forEach((coinCode) => {
        if (!(coinCode in row.valuesByCoin)) {
          row.valuesByCoin[coinCode] = param.factorValue;
        }
      });
    }

    rowsByOrder[sortOrder] = row;
  });

  const sortedOrders = Object.keys(rowsByOrder)
    .map(Number)
    .sort((a, b) => a - b);

  const rowStrings = sortedOrders.map((order) => {
    const row = rowsByOrder[order];
    const perTokenValues = tokenCodes.map(
      (coinCode) => row.valuesByCoin[coinCode] ?? ''
    );
    return `[${perTokenValues.join(', ')}] // ${row.factorName}`;
  });

  return `[\n  ${rowStrings.join(',\n  ')}\n]`;
}

export function PoolDeploymentConfigReview({
  pool,
}: PoolDeploymentConfigReviewProps) {
  // Permission bitmasks (as per your comment)
  const MASK_POOL_PERFORM_UPDATE = 1;
  const MASK_POOL_GET_DATA = 2;
  const MASK_POOL_OWNER_UPDATES = 8;
  const MASK_POOL_QUANTAMM_ADMIN_UPDATES = 16;
  const MASK_POOL_RULE_DIRECT_SET_WEIGHT = 32;

  const REGISTRY_PERMISSION_OPTIONS = [
    {
      label: 'Pool can perform updates',
      value: MASK_POOL_PERFORM_UPDATE,
    },
    {
      label: 'Pool can get data',
      value: MASK_POOL_GET_DATA,
    },
    {
      label: 'Pool owner can update weights',
      value: MASK_POOL_OWNER_UPDATES,
    },
    {
      label: 'QuantAMM admin updates allowed',
      value: MASK_POOL_QUANTAMM_ADMIN_UPDATES,
    },
    {
      label: 'Rule can directly set weights',
      value: MASK_POOL_RULE_DIRECT_SET_WEIGHT,
    },
  ];

  const [registryMaskSelections, setRegistryMaskSelections] = useState<
    number[]
  >([]);
  const handleRegistryPermissionsChange = (values: (string | number)[]) => {
    const numericValues = values.map((v) =>
      typeof v === 'number' ? v : parseInt(String(v), 10)
    );
    setRegistryMaskSelections(numericValues);

    // Bitwise OR of all selected mask values
    const combined = numericValues.reduce((acc, v) => acc | v, 0);

    setPoolParams((prev) => ({
      ...prev,
      poolRegistry: combined.toString(),
    }));
  };

  const [targetChain, setTargetChain] = useState<Chain>(Chain.Ethereum);

  const [deploymentInput, setDeploymentInput] =
    useState<LocalQuantAMMDeploymentInputParams>({
      Vault: '',
      PauseWindowDuration: null,
      UpdateWeightRunner: '',
      FactoryVersion: '',
      PoolVersion: '',
    });

  const [poolParams, setPoolParams] = useState<LocalCreationNewPoolParams>({
    name: pool.name,
    symbol: pool.name.replace(/\s+/g, ''),
    normalizedWeights: pool.poolConstituents
      .map((poolCoin) => (poolCoin.weight ?? 0).toString())
      .join(', '),
    swapFeePercentage: '',
    poolHooksContract: '',
    enableDonation: false,
    disableUnbalancedLiquidity: false,
    salt: '',
    initialWeights: '',
    poolSettings: {
      assets: pool.poolConstituents
        .map((poolCoin) => poolCoin.coin.coinCode)
        .join(', '),
      rule: pool.updateRule.updateRuleName,
      updateInterval: null,
      lambda: '',
      epsilonMax: '',
      absoluteWeightGuardRail: '',
      maxTradeSizeRatio: '',
      // initialise from update rule parameters in smart-contract order
      ruleParameters: buildRuleParametersString(pool),
      poolManager: '',
    },
    initialMovingAverages: '',
    initialIntermediateValues: '',
    oracleStalenessThreshold: '',
    poolRegistry: '',
    poolDetails: '',
  });

  // Whenever targetChain changes, hydrate token addresses from deploymentByChain
  useEffect(() => {
    setPoolParams((prev) => {
      const updatedTokens: LocalTokenConfig[] = pool.poolConstituents.map(
        (poolCoin, index) => {
          const coin = poolCoin.coin;
          const deployedToken = getDeploymentForChain(
            coin.deploymentByChain,
            targetChain
          );

          return {
            id: `${coin.coinCode}-${index}`,
            displayName: `${coin.coinName} (${coin.coinCode})`,
            token: deployedToken ? deployedToken.address : '',
            rateProvider: '',
            tokenType: 0,
          };
        }
      );

      return {
        ...prev,
        tokens: updatedTokens,
      };
    });
  }, [pool.poolConstituents, targetChain]);

  const handleDeploymentInputChange = (
    key: keyof LocalQuantAMMDeploymentInputParams,
    value: string | number | null
  ) => {
    setDeploymentInput((prev) => ({
      ...prev,
      [key]:
        typeof prev[key] === 'number'
          ? (value as number | null)
          : (value as string),
    }));
  };

  const handlePoolParamChange = (
    key: keyof LocalCreationNewPoolParams,
    value: string | boolean
  ) => {
    setPoolParams((prev) => ({
      ...prev,
      [key]: value as never,
    }));
  };

  const handlePoolSettingsChange = (
    key: keyof LocalPoolSettings,
    value: string | number | null
  ) => {
    setPoolParams((prev) => ({
      ...prev,
      poolSettings: {
        ...prev.poolSettings,
        [key]:
          typeof prev.poolSettings[key] === 'number'
            ? (value as number | null)
            : (value as string),
      },
    }));
  };

  return (
    <Row className={styles.simRunSection} gutter={[24, 24]}>
      <Col span={24}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Simulation & Pool Overview */}
          <Divider>Simulation &amp; Pool Overview</Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              style={{ width: '100%' }}
              value={targetChain}
              onChange={(value) => setTargetChain(value as Chain)}
              options={Object.values(Chain).map((c) => ({
                label: String(c),
                value: c,
              }))}
              placeholder="Select target chain"
            />

            <Divider orientation="left">Pool Constituents</Divider>
            <Row gutter={[8, 8]}>
                  <Col span={3}>
                    Token Code
                  </Col>
                  <Col span={8}>
                    Token {targetChain} Address
                  </Col>
                  <Col span={8}>
                    Oracle Address
                  </Col>
                  <Col span={5}>
                    Approval Status
                  </Col>
                </Row>
            {pool.poolConstituents.map((poolCoin, index) => (
              <>
                
                <Row key={`${poolCoin.coin.coinCode}-${index}`} gutter={[8, 8]}>
                  <Col span={3}>
                    <Input value={`${poolCoin.coin.coinCode}`} disabled />
                  </Col>
                  <Col span={8}>
                    <Input
                      value={`${
                        poolCoin.coin.deploymentByChain.get(targetChain)
                          ?.address ?? 'UNKNOWN'
                      }`}
                      disabled
                    />
                  </Col>
                  <Col span={8}>
                    <Input
                      value={
                        poolCoin.coin.deploymentByChain
                          .get(targetChain)
                          ?.oracles.get('Chainlink') ?? 'UNKNOWN'
                      }
                      disabled
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      value={
                        poolCoin.coin.deploymentByChain.get(targetChain)
                          ?.approvalStatus
                          ? 'APPROVED'
                          : 'REQUIRES APPROVAL'
                      }
                      disabled
                    />
                  </Col>
                </Row>
              </>
            ))}
          </Space>

          {/* Deployment parameters shared across scripts */}
          <Divider>Deployment Parameters (input.ts / index.ts)</Divider>

          <Divider orientation="left">
            QuantAMMDeploymentInputParams (input.ts)
          </Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              addonBefore="Vault"
              value={deploymentInput.Vault}
              onChange={(e) =>
                handleDeploymentInputChange('Vault', e.target.value)
              }
            />
            <InputNumber
              style={{ width: '100%' }}
              addonBefore="PauseWindowDuration"
              value={deploymentInput.PauseWindowDuration}
              onChange={(value) =>
                handleDeploymentInputChange('PauseWindowDuration', value)
              }
            />
            <Input
              addonBefore="UpdateWeightRunner"
              value={deploymentInput.UpdateWeightRunner}
              onChange={(e) =>
                handleDeploymentInputChange(
                  'UpdateWeightRunner',
                  e.target.value
                )
              }
            />
            <Input
              addonBefore="FactoryVersion"
              value={deploymentInput.FactoryVersion}
              onChange={(e) =>
                handleDeploymentInputChange('FactoryVersion', e.target.value)
              }
            />
            <Input
              addonBefore="PoolVersion"
              value={deploymentInput.PoolVersion}
              onChange={(e) =>
                handleDeploymentInputChange('PoolVersion', e.target.value)
              }
            />
          </Space>

          {/* Creation / pool params */}
          <Divider orientation="left">
            CreationNewPoolParams (input.ts / index.ts)
          </Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              addonBefore="Pool Name"
              value={poolParams.name}
              onChange={(e) => handlePoolParamChange('name', e.target.value)}
            />
            <Input
              addonBefore="Symbol"
              value={poolParams.symbol}
              onChange={(e) => handlePoolParamChange('symbol', e.target.value)}
            />
            <Input
              addonBefore="normalizedWeights"
              value={poolParams.normalizedWeights}
              onChange={(e) =>
                handlePoolParamChange('normalizedWeights', e.target.value)
              }
            />

            <Divider orientation="left">Swap &amp; Hooks</Divider>
            <Input
              addonBefore="swapFeePercentage"
              value={poolParams.swapFeePercentage}
              onChange={(e) =>
                handlePoolParamChange('swapFeePercentage', e.target.value)
              }
            />
            <Input
              addonBefore="poolHooksContract"
              value={poolParams.poolHooksContract}
              onChange={(e) =>
                handlePoolParamChange('poolHooksContract', e.target.value)
              }
            />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Space>
                  <Text>enableDonation</Text>
                  <Switch
                    checked={poolParams.enableDonation}
                    onChange={(checked) =>
                      handlePoolParamChange('enableDonation', checked)
                    }
                  />
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Text>disableUnbalancedLiquidity</Text>
                  <Switch
                    checked={poolParams.disableUnbalancedLiquidity}
                    onChange={(checked) =>
                      handlePoolParamChange(
                        'disableUnbalancedLiquidity',
                        checked
                      )
                    }
                  />
                </Space>
              </Col>
            </Row>
            <Input
              addonBefore="salt"
              value={poolParams.salt}
              onChange={(e) => handlePoolParamChange('salt', e.target.value)}
            />

            <Divider orientation="left">Initial State</Divider>
            <Input
              addonBefore="_initialWeights"
              value={poolParams.initialWeights}
              onChange={(e) =>
                handlePoolParamChange('initialWeights', e.target.value)
              }
            />
            <Input
              addonBefore="_initialMovingAverages"
              value={poolParams.initialMovingAverages}
              onChange={(e) =>
                handlePoolParamChange('initialMovingAverages', e.target.value)
              }
            />
            <Input
              addonBefore="_initialIntermediateValues"
              value={poolParams.initialIntermediateValues}
              onChange={(e) =>
                handlePoolParamChange(
                  'initialIntermediateValues',
                  e.target.value
                )
              }
            />
            <Input
              addonBefore="_oracleStalenessThreshold"
              value={poolParams.oracleStalenessThreshold}
              onChange={(e) =>
                handlePoolParamChange(
                  'oracleStalenessThreshold',
                  e.target.value
                )
              }
            />

            <Divider orientation="left">Pool Settings</Divider>
            <Input
              addonBefore="assets"
              value={poolParams.poolSettings.assets}
              onChange={(e) =>
                handlePoolSettingsChange('assets', e.target.value)
              }
            />
            <Input
              addonBefore="rule"
              value={poolParams.poolSettings.rule}
              onChange={(e) => handlePoolSettingsChange('rule', e.target.value)}
            />
            <InputNumber
              style={{ width: '100%' }}
              addonBefore="updateInterval"
              value={poolParams.poolSettings.updateInterval}
              onChange={(value) =>
                handlePoolSettingsChange('updateInterval', value)
              }
            />
            <Input
              addonBefore="lambda"
              value={poolParams.poolSettings.lambda}
              onChange={(e) =>
                handlePoolSettingsChange('lambda', e.target.value)
              }
            />
            <Input
              addonBefore="epsilonMax"
              value={poolParams.poolSettings.epsilonMax}
              onChange={(e) =>
                handlePoolSettingsChange('epsilonMax', e.target.value)
              }
            />
            <Input
              addonBefore="absoluteWeightGuardRail"
              value={poolParams.poolSettings.absoluteWeightGuardRail}
              onChange={(e) =>
                handlePoolSettingsChange(
                  'absoluteWeightGuardRail',
                  e.target.value
                )
              }
            />
            <Input
              addonBefore="maxTradeSizeRatio"
              value={poolParams.poolSettings.maxTradeSizeRatio}
              onChange={(e) =>
                handlePoolSettingsChange('maxTradeSizeRatio', e.target.value)
              }
            />

            <Input
              addonBefore="Update Rule"
              value={pool.updateRule.updateRuleName}
              disabled
            />
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>ruleParameters</Text>
              <Input.TextArea
                rows={4}
                value={poolParams.poolSettings.ruleParameters}
                onChange={(e) =>
                  handlePoolSettingsChange('ruleParameters', e.target.value)
                }
              />
            </Space>
            <Input
              addonBefore="poolManager"
              value={poolParams.poolSettings.poolManager}
              onChange={(e) =>
                handlePoolSettingsChange('poolManager', e.target.value)
              }
            />

            <Divider orientation="left">Registry Permissions (bitmask)</Divider>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Checkbox.Group
                options={REGISTRY_PERMISSION_OPTIONS}
                value={registryMaskSelections}
                onChange={handleRegistryPermissionsChange}
              />
              <Input
                addonBefore="poolRegistry (combined mask)"
                value={poolParams.poolRegistry}
                disabled
              />
            </Space>
            <Input
              addonBefore="poolDetails"
              value={poolParams.poolDetails}
              onChange={(e) =>
                handlePoolParamChange('poolDetails', e.target.value)
              }
            />
          </Space>
        </Space>
      </Col>
    </Row>
  );
}
