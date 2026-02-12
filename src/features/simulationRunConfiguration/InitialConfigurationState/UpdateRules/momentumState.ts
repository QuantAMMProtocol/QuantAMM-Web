import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const MomentumState: UpdateRule = {
  updateRuleName: 'Momentum',
  updateRuleKey: 'momentum',
  updateRuleSimKey: 'momentum',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ, which determines how 'aggressive' the pool is, and memory length (in days), which determines how quickly the pool forgets previous data. " +
    'For good choices, this update rule greatly increases capital over HODL (and thus also Balancer) during breakouts and increases capital during sustained bull runs. ' +
    'This rule works best over long price memories, so sudden crashes are not detected and lose capital faster ' +
    'than HODL. This is not a deal-breaker, however, as the capital gain increases (as demonstrated over a super cycle) are still greater than these sharp losses. ' +
    'It often makes sense to have a stablecoin in a pool running this strategy, as during market downturns' +
    'the pool can then smoothly ‘exit to fiat‘, putting greater and greater weight on the stablecoin during these periods.',
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

export const RvrMomentumState: UpdateRule = {
  updateRuleName: 'RVR - Momentum',
  updateRuleKey: 'rvr__momentum',
  updateRuleSimKey: 'rvr__momentum',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['RVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ, which determines how 'aggressive' the pool is, and memory length (in days), which determines how quickly the pool forgets previous data. " +
    'For good choices, this update rule greatly increases capital over HODL (and thus also Balancer) during breakouts and increases capital during sustained bull runs. ' +
    'This rule works best over long price memories, so sudden crashes are not detected and lose capital faster ' +
    'than HODL. This is not a deal-breaker, however, as the capital gain increases (as demonstrated over a super cycle) are still greater than these sharp losses. ' +
    'It often makes sense to have a stablecoin in a pool running this strategy, as during market downturns' +
    'the pool can then smoothly ‘exit to fiat‘, putting greater and greater weight on the stablecoin during these periods.',
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

export const LvrMomentumState: UpdateRule = {
  updateRuleName: 'LVR - Momentum',
  updateRuleKey: 'lvr__momentum',
  updateRuleSimKey: 'lvr__momentum',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['LVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "One gets different returns for different values of κ, which determines how 'aggressive' the pool is, and memory length (in days), which determines how quickly the pool forgets previous data. " +
    'For good choices, this update rule greatly increases capital over HODL (and thus also Balancer) during breakouts and increases capital during sustained bull runs. ' +
    'This rule works best over long price memories, so sudden crashes are not detected and lose capital faster ' +
    'than HODL. This is not a deal-breaker, however, as the capital gain increases (as demonstrated over a super cycle) are still greater than these sharp losses. ' +
    'It often makes sense to have a stablecoin in a pool running this strategy, as during market downturns' +
    'the pool can then smoothly ‘exit to fiat‘, putting greater and greater weight on the stablecoin during these periods.',
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
