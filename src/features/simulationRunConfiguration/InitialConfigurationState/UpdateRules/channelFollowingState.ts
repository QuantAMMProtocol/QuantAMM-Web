import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const ChannelFollowingState: UpdateRule = {
  updateRuleName: 'Channel Following',
  updateRuleKey: 'channelFollowing',
  updateRuleSimKey: 'mean_reversion_channel',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    'The channel following parameters can be divided into three categories' +
    '1. Standard Antimomentum parameters to dictate how antimomentum works when price changes are small' +
    '2. Standard Power channel parameters to dictate how power channel works when price changes are large' +
    '3. Parameters dictating the shape of the gaussian function determining when the rule behaves more like antimomentum or power channel' +
    'width dictates the width of the channel where antimomentum is used. ' +
    'amplitude dictates how fast one rule changes from the other when the edge of the channel approaches.' +
    '',
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
    {
      factorName: 'exponent',
      factorDisplayName: 'Exponent',
      factorDescription:
        'Controls the exponential non-linearity that is applied to the price change signal',
      applicableCoins: [],
      factorValue: '2',
      minValue: '0',
      maxValue: '20',
      smartContractSortOrder: 2,
    },
    {
      factorName: 'amplitude',
      factorDisplayName: 'Amplitude',
      factorDescription:
        'Controls the strength of the mean reversion effect within the channel',
      applicableCoins: [],
      factorValue: '1',
      minValue: '0',
      maxValue: '3000',
      smartContractSortOrder: 3,
    },
    {
      factorName: 'width',
      factorDisplayName: 'Width',
      factorDescription: 'Controls the width of the channel',
      applicableCoins: [],
      factorValue: '1',
      minValue: '0',
      maxValue: '400',
      smartContractSortOrder: 4,
    },
    {
      factorName: 'pre_exp_scaling',
      factorDisplayName: 'Scaling',
      factorDescription: 'Controls the scaling of the price gradient',
      applicableCoins: [],
      factorValue: '0.5',
      minValue: '0',
      maxValue: '400',
      smartContractSortOrder: 5,
    },
  ],
};

export const LvrChannelFollowingState: UpdateRule = {
  updateRuleName: 'LVR - Channel Following',
  updateRuleKey: 'lvr__channelFollowing',
  updateRuleSimKey: 'lvr__mean_reversion_channel',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['LVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    'The channel following parameters can be divided into three categories' +
    '1. Standard Antimomentum parameters to dictate how antimomentum works when price changes are small' +
    '2. Standard Power channel parameters to dictate how power channel works when price changes are large' +
    '3. Parameters dictating the shape of the gaussian function determining when the rule behaves more like antimomentum or power channel' +
    'width dictates the width of the channel where antimomentum is used. ' +
    'amplitude dictates how fast one rule changes from the other when the edge of the channel approaches.' +
    '',
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
    {
      factorName: 'amplitude',
      factorDisplayName: 'Amplitude',
      factorDescription:
        'Controls the strength of the mean reversion effect within the channel',
      applicableCoins: [],
      factorValue: '1',
      minValue: '0',
      maxValue: '20',
      smartContractSortOrder: 4,
    },
    {
      factorName: 'width',
      factorDisplayName: 'Width',
      factorDescription: 'Controls the width of the channel',
      applicableCoins: [],
      factorValue: '1',
      minValue: '0',
      maxValue: '400',
      smartContractSortOrder: 5,
    },
    {
      factorName: 'pre_exp_scaling',
      factorDisplayName: 'Scaling',
      factorDescription: 'Controls the scaling of the price gradient',
      applicableCoins: [],
      factorValue: '0.5',
      minValue: '0',
      maxValue: '400',
      smartContractSortOrder: 6,
    },
  ],
};

export const RvrChannelFollowingState: UpdateRule = {
  updateRuleName: 'RVR - Channel Following',
  updateRuleKey: 'rvr__channelFollowing',
  updateRuleSimKey: 'rvr__mean_reversion_channel',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['RVR for QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    'The channel following parameters can be divided into three categories' +
    '1. Standard Antimomentum parameters to dictate how antimomentum works when price changes are small' +
    '2. Standard Power channel parameters to dictate how power channel works when price changes are large' +
    '3. Parameters dictating the shape of the gaussian function determining when the rule behaves more like antimomentum or power channel' +
    'width dictates the width of the channel where antimomentum is used. ' +
    'amplitude dictates how fast one rule changes from the other when the edge of the channel approaches.' +
    '',
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
    {
      factorName: 'amplitude',
      factorDisplayName: 'Amplitude',
      factorDescription:
        'Controls the strength of the mean reversion effect within the channel',
      applicableCoins: [],
      factorValue: '1',
      minValue: '0',
      maxValue: '20',
      smartContractSortOrder: 4,
    },
    {
      factorName: 'width',
      factorDisplayName: 'Width',
      factorDescription: 'Controls the width of the channel',
      applicableCoins: [],
      factorValue: '1',
      minValue: '0',
      maxValue: '400',
      smartContractSortOrder: 5,
    },
    {
      factorName: 'pre_exp_scaling',
      factorDisplayName: 'Scaling',
      factorDescription: 'Controls the scaling of the price gradient',
      applicableCoins: [],
      factorValue: '0.5',
      minValue: '0',
      maxValue: '400',
      smartContractSortOrder: 6,
    },
  ],
};
