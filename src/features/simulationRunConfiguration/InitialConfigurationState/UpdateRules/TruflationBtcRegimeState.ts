import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const TruflationBtcRegimeState: UpdateRule = {
  updateRuleName: 'Truflation BTC Regime',
  updateRuleKey: 'truflation_regime',
  updateRuleSimKey: 'regime_detection',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  updateRuleResultProfileSummary: 'Using Truflation CPI data as input, this strategy dynamically adjusts portfolio allocations by classifying the market into Uptrend, Downtrend, or Flat regimes based on the calculated slope of the data.' +
    "To filter out noise and prevent 'whipsawing', it employs a state machine with hysteresis thresholds and confirmation delays, requiring a trend to persist for a specific duration before switching regimes." +
    'Upon confirmation, the pool rebalances to a defined set of target weights, favoring risk-on assets in uptrends and risking-off in downtrends.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'slope_length',
      factorDisplayName: 'Slope Length',
      factorDescription: 'Signal lookback period for the slope calculation in days.',
      applicableCoins: [],
      factorValue: '15.0',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'threshold_up',
      factorDisplayName: 'Threshold Up',
      factorDescription: 'The minimum positive slope value required to trigger a potential entry into an Uptrend regime.',
      applicableCoins: [],
      factorValue: '0.0125',
      minValue: '-5000',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'threshold_down',
      factorDisplayName: 'Threshold Down',
      factorDescription: 'The maximum negative slope value required to trigger a potential entry into a Downtrend regime.',
      applicableCoins: [],
      factorValue: '-0.0125',
      minValue: '-5000',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'flat_buffer_up',
      factorDisplayName: 'Flat Buffer Up',
      factorDescription: 'A hysteresis threshold that the slope must fall below to exit a confirmed Uptrend and return to Flat.',
      applicableCoins: [],
      factorValue: '0.005',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'flat_buffer_down',
      factorDisplayName: 'Flat Buffer Down',
      factorDescription: 'A hysteresis threshold that the slope must rise above to exit a confirmed Downtrend and return to Flat.',
      applicableCoins: [],
      factorValue: '-0.005',
      minValue: '-5000',
      maxValue: '0',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_up_days',
      factorDisplayName: 'Confirm Up Days',
      factorDescription: 'The number of consecutive time steps the slope must satisfy Uptrend criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '5',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_down_days',
      factorDisplayName: 'Confirm Down Days',
      factorDescription: 'The number of consecutive time steps the slope must satisfy Downtrend criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '5',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_flat_days',
      factorDisplayName: 'Confirm Flat Days',
      factorDescription: 'The number of consecutive time steps the slope must satisfy Flat criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '4',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
  ],
  chainDeploymentDetails: new Map<Chain, string>(),
};

export const LvrTruflationBtcRegimeState: UpdateRule = {
  updateRuleName: 'Truflation BTC Regime',
  updateRuleKey: 'truflation_regime',
  updateRuleSimKey: 'regime_detection',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    'Using Truflation CPI data as input, this strategy dynamically adjusts portfolio allocations by classifying the market into Uptrend, Downtrend, or Flat regimes based on the calculated slope of the data.' +
    "To filter out noise and prevent 'whipsawing', it employs a state machine with hysteresis thresholds and confirmation delays, requiring a trend to persist for a specific duration before switching regimes." +
    'Upon confirmation, the pool rebalances to a defined set of target weights, favoring risk-on assets in uptrends and risking-off in downtrends.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'slope_length',
      factorDisplayName: 'Slope Length',
      factorDescription:
        'Signal lookback period for the slope calculation in days.',
      applicableCoins: [],
      factorValue: '15.0',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'threshold_up',
      factorDisplayName: 'Threshold Up',
      factorDescription:
        'The minimum positive slope value required to trigger a potential entry into an Uptrend regime.',
      applicableCoins: [],
      factorValue: '0.0125',
      minValue: '-5000',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'threshold_down',
      factorDisplayName: 'Threshold Down',
      factorDescription:
        'The maximum negative slope value required to trigger a potential entry into a Downtrend regime.',
      applicableCoins: [],
      factorValue: '-0.0125',
      minValue: '-5000',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'flat_buffer_up',
      factorDisplayName: 'Flat Buffer Up',
      factorDescription:
        'A hysteresis threshold that the slope must fall below to exit a confirmed Uptrend and return to Flat.',
      applicableCoins: [],
      factorValue: '0.005',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'flat_buffer_down',
      factorDisplayName: 'Flat Buffer Down',
      factorDescription:
        'A hysteresis threshold that the slope must rise above to exit a confirmed Downtrend and return to Flat.',
      applicableCoins: [],
      factorValue: '-0.005',
      minValue: '-5000',
      maxValue: '0',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_up_days',
      factorDisplayName: 'Confirm Up Days',
      factorDescription:
        'The number of consecutive time steps the slope must satisfy Uptrend criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '5',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_down_days',
      factorDisplayName: 'Confirm Down Days',
      factorDescription:
        'The number of consecutive time steps the slope must satisfy Downtrend criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '5',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_flat_days',
      factorDisplayName: 'Confirm Flat Days',
      factorDescription:
        'The number of consecutive time steps the slope must satisfy Flat criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '4',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
  ],
};

export const RvrTruflationBtcRegimeState: UpdateRule = {
  updateRuleName: 'Truflation BTC Regime',
  updateRuleKey: 'truflation_regime',
  updateRuleSimKey: 'regime_detection',
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  applicablePoolTypes: ['QuantAMM'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleResultProfileSummary:
    'Using Truflation CPI data as input, this strategy dynamically adjusts portfolio allocations by classifying the market into Uptrend, Downtrend, or Flat regimes based on the calculated slope of the data.' +
    "To filter out noise and prevent 'whipsawing', it employs a state machine with hysteresis thresholds and confirmation delays, requiring a trend to persist for a specific duration before switching regimes." +
    'Upon confirmation, the pool rebalances to a defined set of target weights, favoring risk-on assets in uptrends and risking-off in downtrends.',
  heatmapKeys: [],
  updateRuleParameters: [
    {
      factorName: 'slope_length',
      factorDisplayName: 'Slope Length',
      factorDescription:
        'Signal lookback period for the slope calculation in days.',
      applicableCoins: [],
      factorValue: '15.0',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'threshold_up',
      factorDisplayName: 'Threshold Up',
      factorDescription:
        'The minimum positive slope value required to trigger a potential entry into an Uptrend regime.',
      applicableCoins: [],
      factorValue: '0.0125',
      minValue: '-5000',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'threshold_down',
      factorDisplayName: 'Threshold Down',
      factorDescription:
        'The maximum negative slope value required to trigger a potential entry into a Downtrend regime.',
      applicableCoins: [],
      factorValue: '-0.0125',
      minValue: '-5000',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'flat_buffer_up',
      factorDisplayName: 'Flat Buffer Up',
      factorDescription:
        'A hysteresis threshold that the slope must fall below to exit a confirmed Uptrend and return to Flat.',
      applicableCoins: [],
      factorValue: '0.005',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'flat_buffer_down',
      factorDisplayName: 'Flat Buffer Down',
      factorDescription:
        'A hysteresis threshold that the slope must rise above to exit a confirmed Downtrend and return to Flat.',
      applicableCoins: [],
      factorValue: '-0.005',
      minValue: '-5000',
      maxValue: '0',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_up_days',
      factorDisplayName: 'Confirm Up Days',
      factorDescription:
        'The number of consecutive time steps the slope must satisfy Uptrend criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '5',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_down_days',
      factorDisplayName: 'Confirm Down Days',
      factorDescription:
        'The number of consecutive time steps the slope must satisfy Downtrend criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '5',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'confirm_flat_days',
      factorDisplayName: 'Confirm Flat Days',
      factorDescription:
        'The number of consecutive time steps the slope must satisfy Flat criteria to officially confirm the regime.',
      applicableCoins: [],
      factorValue: '4',
      minValue: '0',
      maxValue: '5000',
      smartContractSortOrder: 0,
    },
  ],
};
