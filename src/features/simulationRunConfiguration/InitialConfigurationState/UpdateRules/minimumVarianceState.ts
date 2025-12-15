import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const MinimumVarianceState: UpdateRule = {
  updateRuleName: 'Min Variance',
  updateRuleKey: 'min_variance',
  updateRuleSimKey: 'min_variance',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "This rules has two memory lengths: 'memory_days', the memory length of the process that " +
    "estimates the inverse variance of returns (needed to calculate the currently-estimated minimum-variance portfolio); and 'mixing_memory_days', the time it takes to get to a new portfolio vector. " +
    'This rule, unsurprisingly as it aims for a minimum-variance portfolio, ' +
    'tends to lead to returns close to 0. This rule makes most sense when a stablecoin is NOT present ' +
    'in the pool; if a stablecoin is present it comes to dominate the portfolio as it (hopefully) has almost no ' +
    'change in value over time so vanishing variance.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'memory_days_1',
      factorDisplayName: 'Variance memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data when calculating asset variance',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 1,
    },
    {
      factorName: 'memory_days_2',
      factorDisplayName: 'Portfolio smoothing memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data when calculating the overall portfolio',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 2,
    },
  ],
};

export const LvrMinimumVarianceState: UpdateRule = {
  updateRuleName: 'LVR - Min Variance',
  updateRuleKey: 'lvr__min_variance',
  updateRuleSimKey: 'lvr__min_variance',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['LVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "This rules has two memory lengths: 'memory_days', the memory length of the process that " +
    "estimates the inverse variance of returns (needed to calculate the currently-estimated minimum-variance portfolio); and 'mixing_memory_days', the time it takes to get to a new portfolio vector. " +
    'This rule, unsurprisingly as it aims for a minimum-variance portfolio, ' +
    'tends to lead to returns close to 0. This rule makes most sense when a stablecoin is NOT present ' +
    'in the pool; if a stablecoin is present it comes to dominate the portfolio as it (hopefully) has almost no ' +
    'change in value over time so vanishing variance.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'memory_days_1',
      factorDisplayName: 'Variance memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data when calculating asset variance',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 1,
    },
    {
      factorName: 'memory_days_2',
      factorDisplayName: 'Portfolio smoothing memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data when calculating the overall portfolio',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 2,
    },
  ],
};

export const RvrMinimumVarianceState: UpdateRule = {
  updateRuleName: 'RVR - Min Variance',
  updateRuleKey: 'rvr__min_variance',
  updateRuleSimKey: 'rvr__min_variance',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['RVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    "This rules has two memory lengths: 'memory_days', the memory length of the process that " +
    "estimates the inverse variance of returns (needed to calculate the currently-estimated minimum-variance portfolio); and 'mixing_memory_days', the time it takes to get to a new portfolio vector. " +
    'This rule, unsurprisingly as it aims for a minimum-variance portfolio, ' +
    'tends to lead to returns close to 0. This rule makes most sense when a stablecoin is NOT present ' +
    'in the pool; if a stablecoin is present it comes to dominate the portfolio as it (hopefully) has almost no ' +
    'change in value over time so vanishing variance.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'memory_days_1',
      factorDisplayName: 'Variance memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data when calculating asset variance',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 1,
    },
    {
      factorName: 'memory_days_2',
      factorDisplayName: 'Portfolio smoothing memory in days',
      factorDescription:
        'Determines how quickly the pool forgets previous data when calculating the overall portfolio',
      applicableCoins: [],
      factorValue: '10',
      minValue: '1',
      maxValue: '1095',
      smartContractSortOrder: 2,
    },
  ],
};
