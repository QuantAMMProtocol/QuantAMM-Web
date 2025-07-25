import { ReturnTimeStep } from '../simulationResults/simulationResultSummaryModels';
import {
  CoinComparison,
  CoinPrice,
  SimulationRunConfig,
} from './simulationRunConfigModels';

export const ConfigInitialState: SimulationRunConfig = {
  startDate: '2024-01-01 00:00:00',
  endDate: '2025-04-16 23:59:00',
  coinLoadStatus: [],
  coinPriceHistoryLoadedStatus: 'pending',
  simulationSimplifiedIncludeLvrRuns: false,
  simulationSimplifiedIncludeRvrRuns: false,
  status: {
    status: 'Not Started',
    priceHistoryLoad: 0,
    simulationRunProgress: 0,
  },
  dateRangesToRun: [
    {
      startDate: '2021-02-03 00:00:00',
      endDate: '2022-07-22 23:59:00',
      name: 'custom',
    },
  ],
  exampleSimRunPeriods: [
    {
      startDate: '2020-11-20 00:00:00',
      endDate: '2022-07-22 23:59:00',
      name: 'super cycle',
    },
    {
      startDate: '2020-11-20 00:00:00',
      endDate: '2021-05-11 23:59:00',
      name: 'bull run 1',
    },
    {
      startDate: '2021-07-10 00:00:00',
      endDate: '2021-11-15 23:59:00',
      name: 'bull run 2',
    },
    {
      startDate: '2021-11-15 00:00:00',
      endDate: '2022-07-10 23:59:00',
      name: 'bear run 1',
    },
    {
      startDate: '2021-03-14 00:00:00',
      endDate: '2021-07-23 23:59:00',
      name: 'bear run 2',
    },
  ],
  selectedCoinsToAddToPool: [],
  selectedSimplifiedPools: [],
  selectedInitialCoinMarketValue: null,
  simulationRunning: false,
  coinPriceHistoryLoaded: false,
  selectedUpdateRulesToSimulate: [
    {
      updateRuleName: 'Momentum',
      updateRuleKey: 'momentum',
      updateRuleSimKey: 'momentum',
      updateRuleResultProfileSummary: '',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
      updateRuleParameters: [
        {
          factorName: 'k_per_day',
          factorDisplayName: 'K per day',
          factorDescription: 'Determines how aggressive the pool is',
          applicableCoins: [],
          factorValue: '0',
          minValue: '-6',
          maxValue: '5000',
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
        },
      ],
    },
  ],
  gasPriceImport: [],
  availablePoolTypes: [
    {
      name: 'HODL',
      mandatoryProperties: [],
      shortDescription:
        'Buy and Hold. No AMM. No fees. No impermanent loss. Run this as a benchmark',
      requiresPoolNumeraire: false,
    },
    {
      name: 'Balancer Weighted',
      mandatoryProperties: [],
      shortDescription:
        'The classic, the original, the Balancer Weighted Pool. This pool type is a constant function market maker, which means that the pool will always have liquidity for the assets in the pool. This pool type is the most common and is used in most of the pools on the platform.',
      requiresPoolNumeraire: false,
    },
    {
      name: 'LVR for Balancer Weighted',
      mandatoryProperties: [],
      shortDescription:
        'The classic, the original, the Balancer Weighted Pool. This pool type is a constant function market maker, which means that the pool will always have liquidity for the assets in the pool. This pool type is the most common and is used in most of the pools on the platform.',
      requiresPoolNumeraire: false,
    },
    {
      name: 'RVR for Balancer Weighted',
      mandatoryProperties: [],
      shortDescription:
        'The classic, the original, the Balancer Weighted Pool. This pool type is a constant function market maker, which means that the pool will always have liquidity for the assets in the pool. This pool type is the most common and is used in most of the pools on the platform.',
      requiresPoolNumeraire: false,
    },
    {
      name: 'QuantAMM',
      mandatoryProperties: ['Update Rule'],
      shortDescription:
        'QuantAMM pools dynamically change their weight over time according to a known strategy or update rule. This allows you to appreciate value from the pool holdings not just fees',
      requiresPoolNumeraire: false,
    },
    {
      name: 'LVR for QuantAMM',
      mandatoryProperties: ['Update Rule'],
      shortDescription:
        'QuantAMM pools dynamically change their weight over time according to a known strategy or update rule. This allows you to appreciate value from the pool holdings not just fees',
      requiresPoolNumeraire: false,
    },
    {
      name: 'RVR for QuantAMM',
      mandatoryProperties: ['Update Rule'],
      shortDescription:
        'QuantAMM pools dynamically change their weight over time according to a known strategy or update rule. This allows you to appreciate value from the pool holdings not just fees',
      requiresPoolNumeraire: false,
    },
    {
      name: 'CowAMM Weighted',
      mandatoryProperties: [],
      shortDescription:
        'CowAMM Weighted pools combine CowSwap with AMMs. Batching and averaging trade price means that scalpers get an average price and dont front run you.' +
        ' This means that with enough retail flow per batch, you pay the market price not the potentially distorted AMM price',
      requiresPoolNumeraire: false,
    },
    {
      name: 'LVR for CowAMM Weighted',
      mandatoryProperties: [],
      shortDescription:
        'CowAMM Weighted pools combine CowSwap with AMMs. Batching and averaging trade price means that scalpers get an average price and dont front run you.' +
        ' This means that with enough retail flow per batch, you pay the market price not the potentially distorted AMM price',
      requiresPoolNumeraire: false,
    },
    {
      name: 'RVR for CowAMM Weighted',
      mandatoryProperties: [],
      shortDescription:
        'CowAMM Weighted pools combine CowSwap with AMMs. Batching and averaging trade price means that scalpers get an average price and dont front run you.' +
        ' This means that with enough retail flow per batch, you pay the market price not the potentially distorted AMM price',
      requiresPoolNumeraire: false,
    },
    {
      name: 'Gyroscope',
      mandatoryProperties: [],
      shortDescription: 'Stable pool with yield',
      requiresPoolNumeraire: true,
    },
    {
      name: 'LVR for Gyroscope',
      mandatoryProperties: [],
      shortDescription: 'Stable pool with yield',
      requiresPoolNumeraire: true,
    },
    {
      name: 'RVR for Gyroscope',
      mandatoryProperties: [],
      shortDescription: 'Stable pool with yield',
      requiresPoolNumeraire: true,
    },
  ],
  availableUpdateRules: [
    {
      updateRuleName: 'HODL',
      updateRuleKey: 'HODL',
      updateRuleSimKey: 'hodl',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleResultProfileSummary:
        'Returns are the change in price relative to the intial reserves',
      heatmapKeys: [],
      applicablePoolTypes: ['HODL'],
      updateRuleParameters: [],
    },
    {
      updateRuleName: 'CowAMM Weighted',
      updateRuleKey: 'CowAMM Weighted',
      updateRuleSimKey: 'cow',
      updateRuleResultProfileSummary: 'CowAMM Weighted simulation engine',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      updateRuleParameters: [
        {
          factorName: 'arb_quality',
          factorDisplayName: 'Solver efficiency',
          factorDescription:
            'There can be enough competition between solvers when batching to fully eliminate LVR, however they can also run sub-optimally',
          applicableCoins: [],
          factorValue: '1.0',
          minValue: '0.0',
          maxValue: '1.0',
        },
        {
          factorName: 'noise_trader_ratio',
          factorDisplayName: 'Noise/Arb Ratio',
          factorDescription:
            'CowAMM shows how noise can be a multiplier of arb volume. This is that multiplier',
          applicableCoins: [],
          factorValue: '0.0',
          minValue: '0.0',
          maxValue: '10.0',
        },
      ],
      applicablePoolTypes: ['CowAMM Weighted'],
    },
    {
      updateRuleName: 'LVR - CowAMM Weighted',
      updateRuleKey: 'lvr__CowAMM',
      updateRuleSimKey: 'lvr__cow',
      updateRuleResultProfileSummary: 'CowAMM Weighted LVR simulation engine',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [],
      applicablePoolTypes: ['LVR for CowAMM Weighted'],
    },
    {
      updateRuleName: 'RVR - CowAMM Weighted',
      updateRuleKey: 'rvr__CowAMM',
      updateRuleSimKey: 'rvr__cow',
      updateRuleResultProfileSummary: 'CowAMM Weighted RVR simulation engine',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [],
      applicablePoolTypes: ['RVR for CowAMM Weighted'],
    },
    {
      updateRuleName: 'Gyroscope',
      updateRuleKey: 'gyroscope',
      updateRuleSimKey: 'gyroscope',
      updateRuleResultProfileSummary: 'Gyroscope simulation engine',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [
        {
          factorName: 'alpha',
          factorDisplayName: 'Lower price bound',
          factorDescription:
            'Top of the price range (denominated in the numeraire token)',
          applicableCoins: [],
          factorValue: '10',
          minValue: '0',
          maxValue: '200000',
        },
        {
          factorName: 'beta',
          factorDisplayName: 'Upper price bound',
          factorDescription:
            'Top of the price range (denominated in the numeraire token)',
          applicableCoins: [],
          factorValue: '20',
          minValue: '0',
          maxValue: '200000',
        },
      ],
      applicablePoolTypes: ['Gyroscope'],
    },
    {
      updateRuleName: 'LVR - Gyroscope',
      updateRuleKey: 'lvr__Gyroscope',
      updateRuleSimKey: 'lvr__gyroscope',
      updateRuleResultProfileSummary: 'Gyroscope LVR simulation engine',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [
        {
          factorName: 'alpha',
          factorDisplayName: 'Lower price bound',
          factorDescription:
            'Top of the price range (denominated in the numeraire token)',
          applicableCoins: [],
          factorValue: '10',
          minValue: '0',
          maxValue: '200000',
        },
        {
          factorName: 'beta',
          factorDisplayName: 'Upper price bound',
          factorDescription:
            'Top of the price range (denominated in the numeraire token)',
          applicableCoins: [],
          factorValue: '20',
          minValue: '0',
          maxValue: '200000',
        },
      ],
      applicablePoolTypes: ['LVR for Gyroscope'],
    },
    {
      updateRuleName: 'RVR - Gyroscope',
      updateRuleKey: 'rvr__Gyroscope',
      updateRuleSimKey: 'rvr__gyroscope',
      updateRuleResultProfileSummary: 'Gyroscope RVR simulation engine',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [
        {
          factorName: 'alpha',
          factorDisplayName: 'Lower price bound',
          factorDescription:
            'Top of the price range (denominated in the numeraire token)',
          applicableCoins: [],
          factorValue: '10',
          minValue: '0',
          maxValue: '200000',
        },
        {
          factorName: 'beta',
          factorDisplayName: 'Upper price bound',
          factorDescription:
            'Top of the price range (denominated in the numeraire token)',
          applicableCoins: [],
          factorValue: '20',
          minValue: '0',
          maxValue: '200000',
        },
      ],
      applicablePoolTypes: ['RVR for Gyroscope'],
    },
    {
      updateRuleName: 'Balancer Weighted',
      updateRuleKey: 'balancer',
      updateRuleSimKey: 'balancer',
      updateRuleResultProfileSummary:
        'As a constant function market maker balancer suffers from impermanent loss leading to negative returns in almost all circumstances.',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      updateRuleParameters: [],
      applicablePoolTypes: ['Balancer Weighted'],
    },
    {
      updateRuleName: 'LVR - Balancer Weighted',
      updateRuleKey: 'lvr__balancer',
      updateRuleSimKey: 'lvr__balancer',
      updateRuleResultProfileSummary:
        'As a constant function market maker balancer suffers from impermanent loss leading to negative returns in almost all circumstances.',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [],
      applicablePoolTypes: ['LVR for Balancer Weighted'],
    },
    {
      updateRuleName: 'RVR - Balancer Weighted',
      updateRuleKey: 'rvr__balancer',
      updateRuleSimKey: 'rvr__balancer',
      updateRuleResultProfileSummary:
        'As a constant function market maker balancer suffers from impermanent loss leading to negative returns in almost all circumstances.',
      heatmapKeys: [],
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: undefined,
      updateRuleParameters: [],
      applicablePoolTypes: ['RVR for Balancer Weighted'],
    },
    {
      updateRuleName: 'Momentum',
      updateRuleKey: 'momentum',
      updateRuleSimKey: 'momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'AntiMomentum',
      updateRuleKey: 'anti_momentum',
      updateRuleSimKey: 'anti_momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'Channel Following',
      updateRuleKey: 'channelFollowing',
      updateRuleSimKey: 'mean_reversion_channel',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
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
        },
        {
          factorName: 'width',
          factorDisplayName: 'Width',
          factorDescription: 'Controls the width of the channel',
          applicableCoins: [],
          factorValue: '1',
          minValue: '0',
          maxValue: '400',
        },
        {
          factorName: 'pre_exp_scaling',
          factorDisplayName: 'Scaling',
          factorDescription: 'Controls the scaling of the price gradient',
          applicableCoins: [],
          factorValue: '0.5',
          minValue: '0',
          maxValue: '400',
        },
      ],
    },
    {
      updateRuleName: 'Difference Momentum',
      updateRuleKey: 'difference_momentum',
      updateRuleSimKey: 'difference_momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
      updateRuleResultProfileSummary:
        'This rule implements a Moving Average Convergence Divergence strategy. It uses two moving averages, one short and one long, and compares their difference to determine a change in pool weights.',
      heatmapKeys: [],
      updateRuleParameters: [
        {
          factorName: 'k_per_day',
          factorDisplayName: 'K per day',
          factorDescription: 'Determines how aggressive the pool is',
          applicableCoins: [],
          factorValue: '12',
          minValue: '-100',
          maxValue: '5000',
        },
        {
          factorName: 'memory_days_2',
          factorDisplayName: 'Short memory in days',
          factorDescription: 'The memory of the short moving average',
          applicableCoins: [],
          factorValue: '10',
          minValue: '1',
          maxValue: '1095',
        },
        {
          factorName: 'memory_days_1',
          factorDisplayName: 'Long memory in days',
          factorDescription: 'The memory of the long moving average',
          applicableCoins: [],
          factorValue: '30',
          minValue: '1',
          maxValue: '1095',
        },
      ],
    },
    {
      updateRuleName: 'Power Channel',
      updateRuleKey: 'power_channel',
      updateRuleSimKey: 'power_channel',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'Min Variance',
      updateRuleKey: 'min_variance',
      updateRuleSimKey: 'min_variance',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'LVR - Momentum',
      updateRuleKey: 'lvr__momentum',
      updateRuleSimKey: 'lvr__momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['LVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'LVR - AntiMomentum',
      updateRuleKey: 'lvr__anti_momentum',
      updateRuleSimKey: 'lvr__anti_momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['LVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'LVR - Channel Following',
      updateRuleKey: 'lvr__channelFollowing',
      updateRuleSimKey: 'lvr__mean_reversion_channel',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['LVR for QuantAMM'],
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
        },
        {
          factorName: 'width',
          factorDisplayName: 'Width',
          factorDescription: 'Controls the width of the channel',
          applicableCoins: [],
          factorValue: '1',
          minValue: '0',
          maxValue: '400',
        },
        {
          factorName: 'pre_exp_scaling',
          factorDisplayName: 'Scaling',
          factorDescription: 'Controls the scaling of the price gradient',
          applicableCoins: [],
          factorValue: '0.5',
          minValue: '0',
          maxValue: '400',
        },
      ],
    },
    {
      updateRuleName: 'LVR - Difference Momentum',
      updateRuleKey: 'lvr__difference_momentum',
      updateRuleSimKey: 'lvr__difference_momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['LVR for QuantAMM'],
      updateRuleResultProfileSummary:
        'This rule implements a Moving Average Convergence Divergence strategy. It uses two moving averages, one short and one long, and compares their difference to determine a change in pool weights.',
      heatmapKeys: [],
      updateRuleParameters: [
        {
          factorName: 'k_per_day',
          factorDisplayName: 'K per day',
          factorDescription: 'Determines how aggressive the pool is',
          applicableCoins: [],
          factorValue: '12',
          minValue: '-100',
          maxValue: '5000',
        },
        {
          factorName: 'memory_days_2',
          factorDisplayName: 'Short memory in days',
          factorDescription: 'The memory of the short moving average',
          applicableCoins: [],
          factorValue: '10',
          minValue: '1',
          maxValue: '1095',
        },
        {
          factorName: 'memory_days_1',
          factorDisplayName: 'Long memory in days',
          factorDescription: 'The memory of the long moving average',
          applicableCoins: [],
          factorValue: '30',
          minValue: '1',
          maxValue: '1095',
        },
      ],
    },
    {
      updateRuleName: 'LVR - Power Channel',
      updateRuleKey: 'lvr__power_channel',
      updateRuleSimKey: 'lvr__power_channel',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['LVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'LVR - Min Variance',
      updateRuleKey: 'lvr__min_variance',
      updateRuleSimKey: 'lvr__min_variance',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['LVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'RVR - Momentum',
      updateRuleKey: 'rvr__momentum',
      updateRuleSimKey: 'rvr__momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['RVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'RVR - AntiMomentum',
      updateRuleKey: 'rvr__anti_momentum',
      updateRuleSimKey: 'rvr__anti_momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['RVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'RVR - Channel Following',
      updateRuleKey: 'rvr__channelFollowing',
      updateRuleSimKey: 'rvr__mean_reversion_channel',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['RVR for QuantAMM'],
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
        },
        {
          factorName: 'width',
          factorDisplayName: 'Width',
          factorDescription: 'Controls the width of the channel',
          applicableCoins: [],
          factorValue: '1',
          minValue: '0',
          maxValue: '400',
        },
        {
          factorName: 'pre_exp_scaling',
          factorDisplayName: 'Scaling',
          factorDescription: 'Controls the scaling of the price gradient',
          applicableCoins: [],
          factorValue: '0.5',
          minValue: '0',
          maxValue: '400',
        },
      ],
    },
    {
      updateRuleName: 'RVR - Difference Momentum',
      updateRuleKey: 'rvr__difference_momentum',
      updateRuleSimKey: 'rvr__difference_momentum',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['RVR for QuantAMM'],
      updateRuleResultProfileSummary:
        'This rule implements a Moving Average Convergence Divergence strategy. It uses two moving averages, one short and one long, and compares their difference to determine a change in pool weights.',
      heatmapKeys: [],
      updateRuleParameters: [
        {
          factorName: 'k_per_day',
          factorDisplayName: 'K per day',
          factorDescription: 'Determines how aggressive the pool is',
          applicableCoins: [],
          factorValue: '12',
          minValue: '-100',
          maxValue: '5000',
        },
        {
          factorName: 'memory_days_2',
          factorDisplayName: 'Short memory in days',
          factorDescription: 'The memory of the short moving average',
          applicableCoins: [],
          factorValue: '10',
          minValue: '1',
          maxValue: '1095',
        },
        {
          factorName: 'memory_days_1',
          factorDisplayName: 'Long memory in days',
          factorDescription: 'The memory of the long moving average',
          applicableCoins: [],
          factorValue: '30',
          minValue: '1',
          maxValue: '1095',
        },
      ],
    },
    {
      updateRuleName: 'RVR - Power Channel',
      updateRuleKey: 'rvr__power_channel',
      updateRuleSimKey: 'rvr__power_channel',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['RVR for QuantAMM'],
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
        },
      ],
    },
    {
      updateRuleName: 'RVR - Min Variance',
      updateRuleKey: 'rvr__min_variance',
      updateRuleSimKey: 'rvr__min_variance',
      updateRuleRunUrl: 'runSimulation',
      updateRuleTrainUrl: 'runTraining',
      applicablePoolTypes: ['RVR for QuantAMM'],
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
        },
      ],
    },
  ],
  availableFeeHooks: [
    {
      hookName: 'swapFee',
      hookTargetTokens: [],
      unit: 'bps',
      hookTimeSteps: undefined,
      minValue: 0.01,
      maxValue: 100,
    },
  ],
  availableCoins: [
    {
      coinName: 'Bitcoin',
      coinCode: 'BTC',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Ethereum',
      coinCode: 'ETH',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Ripple',
      coinCode: 'XRP',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Solana',
      coinCode: 'SOL',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Binance',
      coinCode: 'BNB',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'USDCoin',
      coinCode: 'USDC',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'DogeCoin',
      coinCode: 'DOGE',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Cardano',
      coinCode: 'ADA',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Tron',
      coinCode: 'TRX',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Chainlink',
      coinCode: 'LINK',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Avalanche',
      coinCode: 'AVAX',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Stellar',
      coinCode: 'XLM',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Shiba Inu',
      coinCode: 'SHIB',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Uniswap',
      coinCode: 'UNI',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'AAVE',
      coinCode: 'AAVE',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Monero',
      coinCode: 'XMR',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Polygon',
      coinCode: 'MATIC',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Algorand',
      coinCode: 'ALGO',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Arbitrum',
      coinCode: 'ARB',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Filecoin',
      coinCode: 'FIL',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Cosmos',
      coinCode: 'ATOM',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'EOS',
      coinCode: 'EOS',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Maker DAO',
      coinCode: 'MKR',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Lido',
      coinCode: 'LDO',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'DyDx',
      coinCode: 'DYDX',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Compound',
      coinCode: 'COMP',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Curve',
      coinCode: 'CRV',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'SushiSwap',
      coinCode: 'SUSHI',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'Litecoin',
      coinCode: 'LTC',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    {
      coinName: 'PAX Gold',
      coinCode: 'PAXG',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
  ],
  initialLiquidityPool: {
    id: '12345',
    name: 'stub pool',
    runStatus: 'Pending',
    feeHooks: [],
    swapImports: [],
    poolNumeraireCoinCode: '',
    enableAutomaticArbBots: false,
    updateRule: {
      updateRuleName: 'HODL',
      updateRuleKey: 'HODL',
      updateRuleSimKey: 'hodl',
      updateRuleRunUrl: 'runSimulation',
      applicablePoolTypes: ['HODL'],
      updateRuleTrainUrl: undefined,
      updateRuleResultProfileSummary:
        'Your return is just the price change (proportional per coin held at the start) of each coin over time',
      heatmapKeys: [],
      updateRuleParameters: [],
    },
    poolType: {
      name: 'HODL',
      mandatoryProperties: [],
      shortDescription: 'Buy and hold strategy',
      requiresPoolNumeraire: false,
    },
    poolConstituents: [
      {
        coin: {
          coinName: 'Ethereum',
          coinCode: 'ETH',
          coinComparisons: new Map<string, CoinComparison>(),
          dailyPriceHistoryMap: new Map<number, CoinPrice>(),
          dailyPriceHistory: [
            {
              date: '2020-01-01 00:00:00:00',
              unix: 1234,
              open: 1234,
              high: 1234,
              low: 1234,
              close: 1234,
            },
          ],
          dailyReturns: new Map<number, ReturnTimeStep>(),
        },
        weight: 50,
        currentPrice: 10,
        currentPriceUnix: 1,
        factorValue: '0',
        amount: 10,
        marketValue: 30000000,
      },
      {
        coin: {
          coinName: 'USDCoin',
          coinCode: 'USDC',
          dailyPriceHistoryMap: new Map<number, CoinPrice>(),
          coinComparisons: new Map<string, CoinComparison>(),
          dailyPriceHistory: [
            {
              date: '2020-01-01 00:00:00:00',
              unix: 1234,
              open: 1234,
              high: 1234,
              low: 1234,
              close: 1234,
            },
          ],
          dailyReturns: new Map<number, ReturnTimeStep>(),
        },
        weight: 50,
        currentPrice: 1,
        currentPriceUnix: 1,
        amount: 30000000,
        factorValue: '0',
        marketValue: 30000000,
      },
    ],
  },
  simulationLiquidityPools: [
    {
      id: '12345',
      name: 'stub pool',
      runStatus: 'Pending',
      enableAutomaticArbBots: true,
      feeHooks: [],
      swapImports: [],
      poolNumeraireCoinCode: '',
      poolType: {
        name: 'QuantAMM',
        mandatoryProperties: ['Update Rule'],
        shortDescription: 'Quantitative Automated Market Maker',
        requiresPoolNumeraire: false,
      },
      updateRule: {
        updateRuleName: 'Momentum',
        updateRuleKey: 'momentum',
        updateRuleSimKey: 'momentum',
        updateRuleResultProfileSummary: '',
        applicablePoolTypes: ['QuantAMM'],
        heatmapKeys: [],
        updateRuleRunUrl: 'runSimulation',
        updateRuleTrainUrl: 'runTraining',
        updateRuleParameters: [
          {
            factorName: 'k_per_day',
            factorDisplayName: 'K per day',
            factorDescription: 'Determines how aggressive the pool is',
            applicableCoins: [],
            factorValue: '0',
            minValue: '-6',
            maxValue: '5000',
          },
          {
            factorName: 'memory_days',
            factorDisplayName: 'Memory in days',
            factorDescription:
              'Determines how quickly the pool forgets previous data',
            applicableCoins: [],
            factorValue: '1',
            minValue: '1',
            maxValue: '1095',
          },
        ],
      },
      poolConstituents: [
        {
          coin: {
            coinName: 'Ethereum',
            coinCode: 'ETH',
            dailyPriceHistoryMap: new Map<number, CoinPrice>(),
            coinComparisons: new Map<string, CoinComparison>(),
            dailyPriceHistory: [
              {
                date: '2020-01-01 00:00:00:00',
                unix: 1234,
                open: 1234,
                high: 1234,
                low: 1234,
                close: 1234,
              },
            ],
            dailyReturns: new Map<number, ReturnTimeStep>(),
          },
          weight: 33,
          currentPrice: 10,
          currentPriceUnix: 1,
          amount: 10,
          factorValue: '0',
          marketValue: 30000000,
        },
        {
          coin: {
            coinName: 'Bitcoin',
            coinCode: 'BTC',
            dailyPriceHistoryMap: new Map<number, CoinPrice>(),
            coinComparisons: new Map<string, CoinComparison>(),
            dailyPriceHistory: [
              {
                date: '2020-01-01 00:00:00:00',
                unix: 1234,
                open: 1234,
                high: 1234,
                low: 1234,
                close: 1234,
              },
            ],
            dailyReturns: new Map<number, ReturnTimeStep>(),
          },
          weight: 33,
          currentPrice: 10,
          currentPriceUnix: 1,
          amount: 10,
          factorValue: '0',
          marketValue: 30000000,
        },
        {
          coin: {
            coinName: 'Cardano',
            coinCode: 'ADA',
            dailyPriceHistoryMap: new Map<number, CoinPrice>(),
            coinComparisons: new Map<string, CoinComparison>(),
            dailyPriceHistory: [
              {
                date: '2020-01-01 00:00:00:00',
                unix: 1234,
                open: 1234,
                high: 1234,
                low: 1234,
                close: 1234,
              },
            ],
            dailyReturns: new Map<number, ReturnTimeStep>(),
          },
          weight: 33,
          currentPrice: 10,
          factorValue: '0',
          currentPriceUnix: 1,
          amount: 10,
          marketValue: 30000000,
        },
      ],
    },
  ],
  trainingParameters: {
    trainingParameters: [
      {
        name: 'filename',
        value: 'new training run',
        description: 'string',
        minValue: '',
        maxValue: '',
      },
      {
        name: 'base_lr',
        value: '0.8',
        description:
          'The initial learning rate at the start of the training process.',
        minValue: '0.00001',
        maxValue: '5',
      },
      {
        name: 'optimiser',
        value: 'sgd',
        description:
          "The choice of which optimisation algorithm to use. Default is stochastic gradient descent ('sgd'). Other options include 'adam' and 'rmsprop' (provided by optax).",
        minValue: '',
        maxValue: '',
      },
      {
        name: 'decay_lr_ratio',
        value: '0.8',
        description:
          "the ratio by which to decay the learning rate on plateau (we multiply the current learning rate by a chosen factor if the training objective doesn't improve).",
        minValue: '0.00001',
        maxValue: '0.999',
      },
      {
        name: 'decay_lr_plateau',
        value: '0.5',
        description:
          "By default decay the learning rate on plateau (we multiply the current learning rate by a chosen factor if the training objective doesn't improve). This setting chooses how many iteration we have to wait for with no improvement before applying this reduction. ",
        minValue: '0.00001',
        maxValue: '0.999',
      },
      {
        name: 'batch_size',
        value: '10',
        description: 'The number of training windows used per training step',
        minValue: '1',
        maxValue: '20',
      },
      {
        name: 'train_on_hessian_trace',
        value: 'false',
        description: 'Flag to set objective to hessian trace',
        minValue: 'false',
        maxValue: 'true',
      },
      {
        name: 'min_lr',
        value: '0.1',
        description: 'The minimum learning rate to decay to.',
        minValue: '0.00001',
        maxValue: '0.999',
      },
      {
        name: 'n_iterations',
        value: '1',
        description:
          'The total number of training steps to take in the training of the update rule.',
        minValue: '1',
        maxValue: '10',
      },
      {
        name: 'n_cycles',
        value: '1',
        description:
          "The number of subdivisions of the overall duration of historic training data to create for iterative training-test splits. Ie n_cycles=2 for a year of training data would mean training is first done on the first 6 months of the training data, testing on the following 6 months, followed by training (using the previous parameter values for initialisation) on the second 6 months of data. Only used in 'iterative_train_on_historic_data' runner.",
        minValue: '1',
        maxValue: '10',
      },
      {
        name: 'return_val',
        value: '0.8',
        description:
          'The proportion of the training data to use for validation (ie not training).',
        minValue: '',
        maxValue: '',
      },
      {
        name: 'maximum_change',
        value: '0.1',
        description:
          ' The maximum change in any parameter value per training step.',
        minValue: '',
        maxValue: '',
      },
    ],
  },
};

export const tokenList = [
  {
    coin: {
      coinName: 'Ethereum',
      coinCode: 'ETH',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    weight: 33,
    currentPrice: 10,
    currentPriceUnix: 1,
    amount: 10,
    marketValue: 30000000,
  },
  {
    coin: {
      coinName: 'Bitcoin',
      coinCode: 'BTC',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    weight: 33,
    currentPrice: 10,
    currentPriceUnix: 1,
    amount: 10,
    marketValue: 30000000,
  },
  {
    coin: {
      coinName: 'Cardano',
      coinCode: 'ADA',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    weight: 33,
    currentPrice: 10,
    currentPriceUnix: 1,
    amount: 10,
    marketValue: 30000000,
  },
  {
    coin: {
      coinName: 'USDC',
      coinCode: 'USDC',
      dailyPriceHistoryMap: new Map<number, CoinPrice>(),
      coinComparisons: new Map<string, CoinComparison>(),
      dailyPriceHistory: [
        {
          date: '2020-01-01 00:00:00:00',
          unix: 1234,
          open: 1234,
          high: 1234,
          low: 1234,
          close: 1234,
        },
      ],
      dailyReturns: new Map<number, ReturnTimeStep>(),
    },
    weight: 25,
    currentPrice: 1,
    currentPriceUnix: 1,
    amount: 30000000,
    marketValue: 30000000,
  },
];
