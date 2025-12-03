import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const AntiMomentumState: UpdateRule = {
  updateRuleName: 'AntiMomentum',
  updateRuleKey: 'anti_momentum',
  updateRuleSimKey: 'anti_momentum',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ, which determines how 'aggressive' the pool is, and memory length (in days), which determines how quickly the pool forgets previous data. " +
    'Often this rule outperforms other rules in bear runs, which makes this a useful part of ' +
    'a broader portfolio. This rule also benefits from relatively small κ/step sizes, with good results often for log2(κ)' +
    ' around -4 to 4.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'k_per_day',
      factorDisplayName: 'K per day',
      factorDescription: 'Determines how aggressive the pool is',
      applicableCoins: [],
      factorValue: '4',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
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
      smartContractSortOrder: 1,
    },
  ],
};

export const LvrAntiMomentumState: UpdateRule = {
  updateRuleName: 'LVR - AntiMomentum',
  updateRuleKey: 'lvr__anti_momentum',
  updateRuleSimKey: 'lvr__anti_momentum',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['LVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ, which determines how 'aggressive' the pool is, and memory length (in days), which determines how quickly the pool forgets previous data. " +
    'Often this rule outperforms other rules in bear runs, which makes this a useful part of ' +
    'a broader portfolio. This rule also benefits from relatively small κ/step sizes, with good results often for log2(κ)' +
    ' around -4 to 4.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'k_per_day',
      factorDisplayName: 'K per day',
      factorDescription: 'Determines how aggressive the pool is',
      applicableCoins: [],
      factorValue: '4',
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
  ],
};

export const RvrAntiMomentumState: UpdateRule = {
  updateRuleName: 'RVR - AntiMomentum',
  updateRuleKey: 'rvr__anti_momentum',
  updateRuleSimKey: 'rvr__anti_momentum',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['RVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ, which determines how 'aggressive' the pool is, and memory length (in days), which determines how quickly the pool forgets previous data. " +
    'Often this rule outperforms other rules in bear runs, which makes this a useful part of ' +
    'a broader portfolio. This rule also benefits from relatively small κ/step sizes, with good results often for log2(κ)' +
    ' around -4 to 4.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'k_per_day',
      factorDisplayName: 'K per day',
      factorDescription: 'Determines how aggressive the pool is',
      applicableCoins: [],
      factorValue: '4',
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
  ],
};
