import styles from '../simulationResults/simulationResultSummary.module.css';

import {
  Chain,
  DeployedToken,
  LiquidityPool,
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
import { useEffect, useMemo, useState } from 'react';
import { selectChainDeploymentSettings } from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { useAppSelector } from '../../app/hooks';
import { SimulationResultAnalysisDto } from './simulationRunnerDtos';
import {
  buildRuleParametersString,
  reorderReadoutStringArray,
  sortTokenAddresses,
} from '../simulationRunConfiguration/simulationUtils';
import runnerStyles from './simulationRunnerCommon.module.css';

const { Text } = Typography;

export interface PoolDeploymentConfigReviewProps {
  pool: LiquidityPool;
  initialisationData?: SimulationResultAnalysisDto;
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
  initialWeights: string;
  poolSettings: LocalPoolSettings;
  initialMovingAverages: string;
  initialIntermediateValues: string;
  oracleStalenessThreshold: string;
  tokens: LocalTokenConfig[];
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

export function PoolDeploymentConfigReview({
  pool,
  initialisationData,
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

  const chainDeploymentSettings = useAppSelector(selectChainDeploymentSettings);

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

  const sortedTokenAddresses = useMemo(() => {
    const addresses = pool.poolConstituents
      .map(
        (pc) =>
          getDeploymentForChain(pc.coin.deploymentByChain, targetChain)
            ?.address ?? ''
      )
      .filter((addr) => addr && addr.length > 0);
    return sortTokenAddresses(addresses);
  }, [pool.poolConstituents, targetChain]);
  
  const [poolParams, setPoolParams] = useState<LocalCreationNewPoolParams>({
    name: pool.name,
    symbol: pool.name.replace(/\s+/g, ''),
    normalizedWeights: pool.poolConstituents
      .map((poolCoin) => (poolCoin.weight ?? 0).toString())
      .join(', '),
    swapFeePercentage: '0.003',
    poolHooksContract: 'NONE',
    enableDonation: false,
    disableUnbalancedLiquidity: false,
    initialWeights: '',
    poolSettings: {
      assets: pool.poolConstituents
        .map((poolCoin) => poolCoin.coin.coinCode)
        .join(', '),
      rule: pool.updateRule.updateRuleName,
      updateInterval: null,
      lambda: buildRuleParametersString(pool, initialisationData?.smart_contract_parameters?.strings ?? {}, sortedTokenAddresses, targetChain, true),
      epsilonMax: '0.432',
      absoluteWeightGuardRail: '0.03',
      maxTradeSizeRatio: '0.1',
      // initialise from update rule parameters in smart-contract order
      ruleParameters: buildRuleParametersString(pool, initialisationData?.smart_contract_parameters?.strings ?? {}, sortedTokenAddresses, targetChain, false),
      poolManager: '',
    },
    initialMovingAverages: '',
    initialIntermediateValues: '',
    oracleStalenessThreshold: '',
    tokens: [],
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

  const SimulationPoolOverviewSection = () => (
    <>
      <Divider>Simulation &amp; Pool Overview</Divider>
      <Space direction="vertical" className={runnerStyles.fullWidth}>
        <Select
          className={runnerStyles.fullWidth}
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
          <Col span={2}>Token Code</Col>
          <Col span={8}>Token {targetChain} Address</Col>
          <Col span={8}>Oracle Address</Col>
          <Col span={3}>Approved</Col>
          <Col span={3}>Order</Col>
        </Row>
        {pool.poolConstituents
          .slice()
          .sort((a, b) => {
            const aAddr =
              getDeploymentForChain(a.coin.deploymentByChain, targetChain)
                ?.address ?? '';
            const bAddr =
              getDeploymentForChain(b.coin.deploymentByChain, targetChain)
                ?.address ?? '';
            return (
              sortedTokenAddresses.indexOf(aAddr) -
              sortedTokenAddresses.indexOf(bAddr)
            );
          })
          .map((poolCoin, index) => (
            <Row key={`${poolCoin.coin.coinCode}-${index}`} gutter={[8, 8]}>
              <Col span={2}>
                <Input value={`${poolCoin.coin.coinCode}`} disabled />
              </Col>
              <Col span={8}>
                <Input
                  value={
                    getDeploymentForChain(
                      poolCoin.coin.deploymentByChain,
                      targetChain
                    )?.address ?? 'UNKNOWN'
                  }
                  disabled
                />
              </Col>
              <Col span={8}>
                <Input
                  value={
                    getDeploymentForChain(
                      poolCoin.coin.deploymentByChain,
                      targetChain
                    )?.oracles.get('Chainlink') ?? 'UNKNOWN'
                  }
                  disabled
                />
              </Col>
              <Col span={3}>
                <Input
                  value={
                    getDeploymentForChain(
                      poolCoin.coin.deploymentByChain,
                      targetChain
                    )?.approvalStatus
                      ? 'APPROVED'
                      : 'NOT APPROVED'
                  }
                  disabled
                />
              </Col>
              <Col span={3}>
                <Input
                  value={
                    sortedTokenAddresses.indexOf(
                      getDeploymentForChain(
                        poolCoin.coin.deploymentByChain,
                        targetChain
                      )?.address ?? ''
                    )
                  }
                  disabled
                />
              </Col>
            </Row>
          ))}
      </Space>
    </>
  );

  const DeploymentInputParamsSection = () => (
    <>
      <Divider>Deployment Parameters (input.ts / index.ts)</Divider>
      <Divider orientation="left">
        QuantAMMDeploymentInputParams (input.ts)
      </Divider>
      <Space direction="vertical" className={runnerStyles.fullWidth}>
        <Input
          addonBefore="Vault"
          value={
            chainDeploymentSettings?.get(targetChain)?.balancerVaultAddress ??
            'NOT DEPLOYED'
          }
          readOnly
          disabled
        />
        <Input
          addonBefore="UpdateWeightRunner"
          value={
            chainDeploymentSettings?.get(targetChain)
              ?.updateWeightRunnerAddress ?? 'NOT DEPLOYED'
          }
          readOnly
          disabled
        />
        <Input
          addonBefore="QuantAMM Pool Factory"
          value={
            chainDeploymentSettings?.get(targetChain)
              ?.quantammWeightedPoolFactoryAddress ?? 'NOT DEPLOYED'
          }
          readOnly
          disabled
        />
        <InputNumber
          type="number"
          className={runnerStyles.fullWidth}
          addonBefore="PauseWindowDuration"
          value={deploymentInput.PauseWindowDuration}
          onChange={(value) =>
            setDeploymentInput((prev) => ({
              ...prev,
              PauseWindowDuration: value,
            }))
          }
        />
        <Input addonBefore="FactoryVersion" value="v1" readOnly disabled />
        <Input addonBefore="PoolVersion" value="v1" readOnly disabled />
      </Space>
    </>
  );

  const CreationNewPoolParamsSection = () => (
    <>
      <Divider orientation="left">
        CreationNewPoolParams (input.ts / index.ts)
      </Divider>
      <Space direction="vertical" className={runnerStyles.fullWidth}>
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
                  handlePoolParamChange('disableUnbalancedLiquidity', checked)
                }
              />
            </Space>
          </Col>
        </Row>
        <Divider orientation="left">Initial State</Divider>
        <Input
          addonBefore="_initialWeights"
          value={reorderReadoutStringArray(
            pool,
            initialisationData?.final_weights_strings ?? [],
            sortedTokenAddresses,
            targetChain
          ).join(', ')}
        />
        <Input
          addonBefore="_initialMovingAverages"
          value={reorderReadoutStringArray(
            pool,
            initialisationData?.readouts?.strings?.ewma ?? [],
            sortedTokenAddresses,
            targetChain
          ).join(', ')}
        />
        <Input
          addonBefore="_initialIntermediateValues"
          value={reorderReadoutStringArray(
            pool,
            initialisationData?.readouts?.strings?.running_a ?? [],
            sortedTokenAddresses,
            targetChain
          ).join(', ')}
        />
        <Input
          addonBefore="_oracleStalenessThreshold"
          value={
            initialisationData?.jax_parameters?.chunk_period?.[0] ?? 'UNKNOWN'
          }
        />
        <Divider orientation="left">Pool Settings</Divider>
        <Input
          addonBefore="rule"
          value={poolParams.poolSettings.rule}
          onChange={(e) => handlePoolSettingsChange('rule', e.target.value)}
        />
        <Input
          addonBefore="updateInterval"
          value={initialisationData?.jax_parameters?.chunk_period?.[0] ?? 'UNKNOWN'}
          disabled
        />
        <Input
          addonBefore="lambda"
          value={poolParams.poolSettings.lambda}
          disabled
        />
        <Input
          addonBefore="absoluteWeightGuardRail"
          value={poolParams.poolSettings.absoluteWeightGuardRail}
          onChange={(e) =>
            handlePoolSettingsChange('absoluteWeightGuardRail', e.target.value)
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
        <Space direction="vertical" className={runnerStyles.fullWidth}>
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
          onChange={(e) => handlePoolSettingsChange('poolManager', e.target.value)}
        />

        <Divider orientation="left">Registry Permissions (bitmask)</Divider>
        <Space
          direction="vertical"
          className={runnerStyles.fullWidth}
          size="middle"
        >
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
          onChange={(e) => handlePoolParamChange('poolDetails', e.target.value)}
        />
      </Space>
    </>
  );

  return (
    <Row className={styles.simRunSection} gutter={[24, 24]}>
      <Col span={24}>
        <Space
          direction="vertical"
          className={runnerStyles.fullWidth}
          size="large"
        >
          <SimulationPoolOverviewSection />
          <DeploymentInputParamsSection />
          <CreationNewPoolParamsSection />
        </Space>
      </Col>
    </Row>
  );
}
