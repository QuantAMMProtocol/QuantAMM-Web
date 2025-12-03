import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const PowerChannelState: UpdateRule = {
  updateRuleName: 'Power Channel',
  updateRuleKey: 'power_channel',
  updateRuleSimKey: 'power_channel',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ (how 'aggressive' the pool is), memory length in days (how quickly the pool forgets previous data) and exponent. " +
    'The exponent, when > 1, has the effect of ' +
    'dampening down small weight changes to even smaller values and increasing the effect of larger ' +
    'weight changes. The heatmaps given have exponent = 2. It tends to perform best when a stablecoin is present in the pool. Also note ' +
    'that large (log) kappa values are needed, as this rule tends to decrease the overall scale of the weight changes. ' +
    'Finally, there is a rough linear scaling between exponent and log2(κ). We find roughly that increasing the exponent by 1 ' +
    'increases the optimal log2(κ) by ~10.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'k_per_day',
      factorDisplayName: 'K per day',
      factorDescription: 'Determines how aggressive the pool is',
      applicableCoins: [],
      factorValue: '12',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 1,
    },
    {
      factorName: 'memory_days',
      factorDisplayName: 'Memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 2,
    },
    {
      factorName: 'exponent',
      factorDisplayName: 'Exponent',
      factorDescription:
        'Controls the exponential non-linearity that is applied to the price change signal',
      applicableCoins: [],
      factorValue: '2',
      minValue: '0',
      maxValue: '20',
      smartContractSortOrder: 3,
    },
  ],
};

export const LvrPowerChannelState: UpdateRule = {
  updateRuleName: 'LVR - Power Channel',
  updateRuleKey: 'lvr__power_channel',
  updateRuleSimKey: 'lvr__power_channel',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['LVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ (how 'aggressive' the pool is), memory length in days (how quickly the pool forgets previous data) and exponent. " +
    'The exponent, when > 1, has the effect of ' +
    'dampening down small weight changes to even smaller values and increasing the size of larger ' +
    'weight changes. The heatmaps given have exponent = 2. It tends to perform best when a stablecoin is present in the pool. Also note ' +
    'that large (log) kappa values are needed, as this rule tends to decrease the overall scale of the weight changes. ' +
    'Finally, there is a rough linear scaling between exponent and log2(κ). We find roughly that increasing the exponent by 1 ' +
    'increases the optimal log2(κ) by ~10.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'k_per_day',
      factorDisplayName: 'K per day',
      factorDescription: 'Determines how aggressive the pool is',
      applicableCoins: [],
      factorValue: '12',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 1,
    },
    {
      factorName: 'memory_days',
      factorDisplayName: 'Memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 2,
    },
    {
      factorName: 'exponent',
      factorDisplayName: 'Exponent',
      factorDescription:
        'Controls the exponential non-linearity that is applied to the price change signal',
      applicableCoins: [],
      factorValue: '2',
      minValue: '0',
      maxValue: '20',
      smartContractSortOrder: 3,
    },
  ],
};

export const RvrPowerChannelState: UpdateRule = {
  updateRuleName: 'RVR - Power Channel',
  updateRuleKey: 'rvr__power_channel',
  updateRuleSimKey: 'rvr__power_channel',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['RVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ (how 'aggressive' the pool is), memory length in days (how quickly the pool forgets previous data) and exponent. " +
    'The exponent, when > 1, has the effect of ' +
    'dampening down small weight changes to even smaller values and increasing the size of larger ' +
    'weight changes. The heatmaps given have exponent = 2. It tends to perform best when a stablecoin is present in the pool. Also note ' +
    'that large (log) kappa values are needed, as this rule tends to decrease the overall scale of the weight changes. ' +
    'Finally, there is a rough linear scaling between exponent and log2(κ). We find roughly that increasing the exponent by 1 ' +
    'increases the optimal log2(κ) by ~10.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'k_per_day',
      factorDisplayName: 'K per day',
      factorDescription: 'Determines how aggressive the pool is',
      applicableCoins: [],
      factorValue: '12',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 1,
    },
    {
      factorName: 'memory_days',
      factorDisplayName: 'Memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 2,
    },
    {
      factorName: 'exponent',
      factorDisplayName: 'Exponent',
      factorDescription:
        'Controls the exponential non-linearity that is applied to the price change signal',
      applicableCoins: [],
      factorValue: '2',
      minValue: '0',
      maxValue: '20',
      smartContractSortOrder: 3,
    },
  ],
};
