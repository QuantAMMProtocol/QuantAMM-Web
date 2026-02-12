import {
  BITCOIN,
  ETHEREUM,
  RIPPLE,
  SOLANA,
  BINANCE,
  USDCOIN,
  DOGECOIN,
  CARDANO,
  TRON,
  CHAINLINK,
  AVALANCHE,
  STELLAR,
  SHIBA_INU,
  UNISWAP,
  AAVE,
  SONIC,
  MONERO,
  POLYGON,
  ALGORAND,
  ARBITRUM,
  FILECOIN,
  COSMOS,
  EOS,
  MAKER_DAO,
  LIDO,
  DYDX,
  COMPOUND,
  CURVE,
  SUSHISWAP,
  LITECOIN,
  PAX_GOLD,
} from './InitialConfigurationState/Coins/CoinStates';
import {
  AntiMomentumState,
  LvrAntiMomentumState,
  RvrAntiMomentumState,
} from './InitialConfigurationState/UpdateRules/antimomentumState';
import {
  BalancerWeightedState,
  LvrBalancerWeightedState,
  RvrBalancerWeightedState,
} from './InitialConfigurationState/UpdateRules/balancerWeightedState';
import {
  ChannelFollowingState,
  LvrChannelFollowingState,
  RvrChannelFollowingState,
} from './InitialConfigurationState/UpdateRules/channelFollowingState';
import {
  CowAMMState,
  LvrCowAMMState,
  RvrCowAMMState,
} from './InitialConfigurationState/UpdateRules/cowammState';
import {
  DifferenceMomentumState,
  LvrDifferenceMomentumState,
  RvrDifferenceMomentumState,
} from './InitialConfigurationState/UpdateRules/differenceMomentumState';
import {
  gyroscopeState,
  lvrGyroscopeState,
  rvrGyroscopeState,
} from './InitialConfigurationState/UpdateRules/gyroscopeState';
import { HodlState } from './InitialConfigurationState/UpdateRules/hodlState';
import {
  LvrMinimumVarianceState,
  MinimumVarianceState,
  RvrMinimumVarianceState,
} from './InitialConfigurationState/UpdateRules/minimumVarianceState';
import {
  LvrMomentumState,
  MomentumState,
  RvrMomentumState,
} from './InitialConfigurationState/UpdateRules/momentumState';
import {
  LvrPowerChannelState,
  PowerChannelState,
  RvrPowerChannelState,
} from './InitialConfigurationState/UpdateRules/powerChannelState';
import { TruflationBtcRegimeState } from './InitialConfigurationState/UpdateRules/TruflationBtcRegimeState';
import {
  Chain,
  ChainDeploymentDetails,
  SimulationRunConfig,
} from './simulationRunConfigModels';

const formatYesterdaysEnd = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} 23:59:00`;
};

export const ConfigInitialState: SimulationRunConfig = {
  startDate: '2024-01-01 00:00:00',
  endDate: formatYesterdaysEnd(),
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
  selectedUpdateRulesToSimulate: [MomentumState],
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
    HodlState,
    CowAMMState,
    LvrCowAMMState,
    RvrCowAMMState,
    gyroscopeState,
    lvrGyroscopeState,
    rvrGyroscopeState,
    BalancerWeightedState,
    LvrBalancerWeightedState,
    RvrBalancerWeightedState,
    MomentumState,
    AntiMomentumState,
    ChannelFollowingState,
    DifferenceMomentumState,
    PowerChannelState,
    MinimumVarianceState,
    LvrMomentumState,
    LvrAntiMomentumState,
    LvrChannelFollowingState,
    LvrDifferenceMomentumState,
    LvrPowerChannelState,
    LvrMinimumVarianceState,
    RvrMomentumState,
    RvrAntiMomentumState,
    RvrChannelFollowingState,
    RvrDifferenceMomentumState,
    RvrPowerChannelState,
    RvrMinimumVarianceState,
    TruflationBtcRegimeState,
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
    BITCOIN,
    ETHEREUM,
    RIPPLE,
    SOLANA,
    BINANCE,
    USDCOIN,
    DOGECOIN,
    CARDANO,
    TRON,
    CHAINLINK,
    AVALANCHE,
    STELLAR,
    SHIBA_INU,
    UNISWAP,
    AAVE,
    SONIC,
    MONERO,
    POLYGON,
    ALGORAND,
    ARBITRUM,
    FILECOIN,
    COSMOS,
    EOS,
    MAKER_DAO,
    LIDO,
    DYDX,
    COMPOUND,
    CURVE,
    SUSHISWAP,
    LITECOIN,
    PAX_GOLD,
  ],
  initialLiquidityPool: {
    id: '12345',
    name: 'stub pool',
    runStatus: 'Pending',
    feeHooks: [],
    swapImports: [],
    poolNumeraireCoinCode: '',
    enableAutomaticArbBots: false,
    updateRule: HodlState,
    poolType: {
      name: 'HODL',
      mandatoryProperties: [],
      shortDescription: 'Buy and hold strategy',
      requiresPoolNumeraire: false,
    },
    poolConstituents: [
      {
        coin: ETHEREUM,
        weight: 50,
        currentPrice: 10,
        currentPriceUnix: 1,
        factorValue: '0',
        amount: 10,
        marketValue: 30000000,
      },
      {
        coin: USDCOIN,
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
      updateRule: MomentumState,
      poolConstituents: [
        {
          coin: ETHEREUM,
          weight: 33,
          currentPrice: 10,
          currentPriceUnix: 1,
          amount: 10,
          factorValue: '0',
          marketValue: 30000000,
        },
        {
          coin: BITCOIN,
          weight: 33,
          currentPrice: 10,
          currentPriceUnix: 1,
          amount: 10,
          factorValue: '0',
          marketValue: 30000000,
        },
        {
          coin: CARDANO,
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
  chainDeploymentDetails: new Map<Chain, ChainDeploymentDetails>([
    // Stubbed entries; fill in real deployment details as needed
    [
      Chain.Ethereum,
      {
        updateWeightRunnerAddress: '0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748',
        balancerVaultAddress: '0xbA1333333333a1BA1108E8412f11850A5C319bA9',
        quantammWeightedPoolFactoryAddress:
          '0xD5c43063563f9448cE822789651662cA7DcD5773',
      } as ChainDeploymentDetails,
    ],
    [
      Chain.Arbitrum,
      {
        updateWeightRunnerAddress: '0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
        balancerVaultAddress: '0xbA1333333333a1BA1108E8412f11850A5C319bA9',
        quantammWeightedPoolFactoryAddress:
          '0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295',
      } as ChainDeploymentDetails,
    ],
    [
      Chain.Base,
      {
        updateWeightRunnerAddress: '0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
        balancerVaultAddress: '0xbA1333333333a1BA1108E8412f11850A5C319bA9',
        quantammWeightedPoolFactoryAddress:
          '0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295',
      } as ChainDeploymentDetails,
    ],
    [
      Chain.Sonic,
      {
        updateWeightRunnerAddress: '0xD5c43063563f9448cE822789651662cA7DcD5773',
        balancerVaultAddress: '0xbA1333333333a1BA1108E8412f11850A5C319bA9',
        quantammWeightedPoolFactoryAddress:
          '0x60006d255569b36a3d494e83D182b57acd04D484',
      } as ChainDeploymentDetails,
    ],
  ]),
};

export const tokenList = [
  {
    coin: ETHEREUM,
    weight: 33,
    currentPrice: 10,
    currentPriceUnix: 1,
    amount: 10,
    marketValue: 30000000,
  },
  {
    coin: BITCOIN,
    weight: 33,
    currentPrice: 10,
    currentPriceUnix: 1,
    amount: 10,
    marketValue: 30000000,
  },
  {
    coin: CARDANO,
    weight: 33,
    currentPrice: 10,
    currentPriceUnix: 1,
    amount: 10,
    marketValue: 30000000,
  },
  {
    coin: USDCOIN,
    weight: 25,
    currentPrice: 1,
    currentPriceUnix: 1,
    amount: 30000000,
    marketValue: 30000000,
  },
];
