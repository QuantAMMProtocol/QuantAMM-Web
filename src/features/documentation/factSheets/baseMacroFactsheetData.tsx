import { FactsheetModel } from './factsheetModel';
import { PowerChannelUpdateRule } from '../updateRules/powerChannelUpdateRule';

export const baseMacroFactsheetData: FactsheetModel = {
  poolId: '0xb4161AeA25BD6C5c8590aD50deB4Ca752532F05D',
  poolChain: 'BASE',
  pools: [
    'baseMacroBTFAugTest',
    'baseMacroCFMMAugTest',
    'baseMacroHodlAugTest',
    'baseMacroBTFAugTrain',
    'baseMacroCFMMAugTrain',
    'baseMacroHodlAugTrain',
    'baseMacroBTF2025Test',
    'baseMacroCFMM2025Test',
    'baseMacroHodl2025Test',
  ],
  factsheetImage: {
    image: '/assets/baseMacro_mono.png',
    width: '30%',
    alt: 'BASE MACRO BTF Icon',
  },
  objective:
    'The Base Macro BTF provides exposure to some of the megal cap tokens on Base. The BTF is was trained on more bullish market conditions.',
  deploymentLinks: {
    contractLinks: [
      [
        'Pool Factory Contract',
        'https://basescan.org/address/0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295',
      ],
      [
        'Strategy Contract',
        'https://basescan.org/address/0x4FFE46130bCBb16BF5EDc4bBaa06f158921764C2',
      ],
      [
        'Strategy Runner Contract',
        'https://basescan.org/address/0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7',
      ],
      [
        'Chainlink cbBTC Oracle',
        'https://basescan.org/address/0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F',
      ],
      [
        'Chainlink USDC Oracle',
        'https://basescan.org/address/0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
      ],
      [
        'Chainlink AERO Oracle',
        'https://basescan.org/address/0x4EC5970fC728C5f65ba413992CD5fF6FD70fcfF0',
      ],
      [
        'Chainlink WETH Oracle',
        'https://basescan.org/address/0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
      ],
    ],
  },
  fixedSettings: [
    ['Strategy Interval', '24H'],
    ['Strategy', 'Power Channel'],
    ['Staleness Limit', '24H'],
    ['Swap Fee', '0.03%'],
    ['Withdrawal Fee', '0%'],
    ['Streaming Fee', '0%'],
  ],
  defaultPeriod: ['AugTest', 'Test Period: Aug24-May25'],
  alternatePeriod: ['2025Test', 'Test Period: Jan-May25'],
  trainPeriod: 'AugTrain',
  poolPrefix: 'baseMacro',
  xAxisIntervals: new Map<string, number>([
    ['AugTest', 3],
    ['2025Test', 1],
    ['AugTrain', 1],
    ['default', 22],
  ]),
  mainTitle: 'The Base Macro BTF',
  mainDescription: `Base is one of the pioneering chains for DeFi. It is a layer 2
              solution built on the Ethereum blockchain, designed to provide
              faster and cheaper transactions while maintaining the security and
              decentralization of Ethereum. Base is designed to be a platform
              for building decentralized applications (dApps) and smart
              contracts, enabling developers to create innovative solutions in
              the DeFi space.`,
  cumulativePerformanceOverrideSeriesStrokeColor: {
    'Power Channel': '#c7b283',
    'Balancer Weighted': '#528aae',
    HODL: '#52ad80',
  },
  cumulativePerformanceOverrideSeriesName: {
    'Power Channel': 'BASE MACRO BTF',
    'Balancer Weighted': 'Traditional DEX',
  },

  updateRule: <PowerChannelUpdateRule hideTitle={true} hideImage={true} />,
  advantages: [
    {
      title: 'Advanced Infrastructure',
      description: (
        <>
          <p>BTFs are dynamically weighted Balancer V3 DEX pools</p>
          <p>
            While the rebalancing process of index and ETP products can be an
            inefficient periodic process, the BTF pool offers a price to
            external arbitrageurs that keeps in line with the market price and
            the current BTF weights. This is one of the tried and tested
            innovations of blockchain and requires no complex execution/auction
            and no BTF custodian or governing manager.
          </p>
          <p>
            This also offers an additional swap fee revenue from noise traders
            and DEX Aggregators.
          </p>
        </>
      ),
    },
    {
      title: 'Responsive Strategies',
      description: (
        <>
          <p>QuantAMM believes in transparency though decentralisation</p>
          <p>
            The re-weighting strategy and parameters are a visible contract
            on-chain. No opaque strategy vault managers. Chainlink provides data
            integrity.
          </p>
          <p>
            Given novel patented technology the re-weighting strategies run
            cheaply on-chain and daily re-weighting is possible even on L1s such
            as Ethereum Mainnet.
          </p>
          <p>
            This is important given the majority of liquidity depth is still on
            mainnet
          </p>
        </>
      ),
    },
    {
      title: 'Secure Balancer Vault',
      description: (
        <>
          <p>
            QuantAMM is a Balancer V3 launch partner. The state of the art
            Balancer Vault manages all non custodial deposits and withdrawals
            with advanced disaster recovery features.
          </p>
          <p>
            While QuantAMM has performed competitive and private audits of its
            own, the Balancer Vault has had its own numerous audits, large bug
            bounties and real-time monitoring. The vault manages all pools on
            Balancer V3.
          </p>
        </>
      ),
    },
    {
      title: 'Cross asset baskets',
      description: (
        <>
          <p>
            USDC provides a stablecoin that is the most widely used in DeFi. It
            is the most liquid and widely accepted stablecoin in the crypto
            ecosystem.
          </p>
          <p>
            AERO is a Base native DeFi token. While this token carries potential
            protocol risk and higher volatility, it is a key native token of the
            Base ecosystem.
          </p>
        </>
      ),
    },
  ],
  risks: [
    {
      title: 'Directional Strategies',
      description: (
        <>
          <p>
            Having visible strategies with known parameters is advantageous as
            you can model risk and performance in all the ways traditional
            finance is used to. However they do take positions based on their
            interpretation of markets. This is a directional position that will
            incur risk and loss of capital if the market moves against the
            strategy.
          </p>
          <p>
            As bitcoin is a volatile asset, even though it can be considered a
            safe haven asset, investing in a BTF introduces unique risk.
          </p>
        </>
      ),
    },
    {
      title: 'AMM Mathematics',
      description: (
        <>
          <p>
            Automated market makers have some unique risks if a constituent goes
            to 0 in a depeg scenario.
          </p>
          <p>
            The pools rebalance automatically causing a potential complete loss
            of funds.
          </p>
          <p>
            Balancer V3 has modern features such as pausing a pool to mitigate
            this however a loss in such as is dependant on timing of any
            intervention. If a pool is paused or in a recovery state you can
            still withdraw the underlying assets at a proportional quantity to
            your LP tokens.
          </p>
        </>
      ),
    },
    {
      title: 'Contract Risk',
      description: (
        <>
          <p>
            Blockchain technologies run on largely immutable contracts. There
            are always risks that there is an issue or a deviation from expected
            behaviour in the code. This could range from minor deviations of
            intended logic to capital loss.
          </p>
          <p>
            QuantAMM has performed private audits of the codebase as well as
            competition based audits. Balancer has also performed the same and
            has large bug bounties to incentivise identification of any issues.
          </p>
        </>
      ),
    },
    {
      title: 'Oracle / Data Manipulation',
      description: (
        <>
          <p>
            Re-weightings rely on price data. This data has to be correct for
            the strategy to run.
          </p>
          <p>
            Chainlink is an oracle provider that provides data integrity through
            proof of consensus. This oracle network is the institutional
            standard for on-chain data and is resilient to manipulation.
            QuantAMM strategies also rely on smoothing of data and work in terms
            of days. This also provides a level of protection at the algorithmic
            layer.
          </p>
        </>
      ),
    },
  ],
  trainingWindowTitle: 'Training window March 2021 - Aug 2024',
  trainingDescription: (
    <>
      <p>
        The power channel strategy has parameters that determine how aggressive
        a strategy re-weights to different assets as well as the memory of
        prices that get taken into account.
      </p>
      <p>
        A training period of March 2021-August 2024 was selected and parameters
        were selected using the machine learning technique called: Stochastic
        Gradient Descent. This was performed by the QuantAMM team using the
        QuantAMM simulator framework. A parameter set was selected that
        maximised the Sharpe Ratio of the strategy. This was selected over other
        objectives such as maximising Ulcer or Calmer Ratios as the parameter
        set showed better test set statistics. Random 1038-day length windows
        were selected within the training price range and optimisation was
        performed via stochastic gradient descent for 6000 steps with batches of
        6 windows per step.
      </p>
    </>
  ),
  trainedParameters: [
    {
      name: 'Multi-block MEV',
      variations: [
        {
          name: 'Guard Rails',
          tooltip:
            'Absolute minimum weight guard rails of 10% and 3% were tested. The final guard rail chosen was 3%.',
          value: ['3%'],
        },
        {
          name: 'Speed Limit',
          tooltip:
            'The speed limit weights can change in one day (epsilon max) was selected to be 0.432. The speed limit is tied to a maximum trade size of 10% of pool constituent reserves.',
          value: ['0.432'],
        },
      ],
    },
    {
      name: 'Lambda Settings',
      variations: [
        {
          name: 'Lambda',
          tooltip:
            'Lambda is the parameter used in the gradient estimators for the power channel. This is the on-chain value stored in the contracts.',
          value: [
            'cbBTC - 0.9784309018144351',
            'AERO - 0.9925922273835435',
            'USDC - 0.6009182385585357',
            'WETH - 0.2679511251319175',
          ],
        },
        {
          name: 'Memory Days',
          tooltip:
            'Memory days is a conversion of the lambda setting to a more understandable unit of the number of days of prices used in the strategy.',
          value: [
            'cbBTC - 167.272730',
            'AERO - 365.0',
            'USDC - 7.684642',
            'WETH - 3.200556',
          ],
        },
      ],
    },
    {
      name: 'Aggressiveness',
      variations: [
        {
          name: 'Aggressiveness',
          tooltip:
            'Otherwise known as k_per_day. This is the multiplier applied to the strategy signal to get the weight change per day.',
          value: [
            'cbBTC - 5.608611948',
            'AERO - 43.81829052',
            'USDC - 7.015760734',
            'WETH - 39.89684253',
          ],
        },
        {
          name: 'k',
          tooltip:
            'k is the on-chain value stored in the contracts and is the exact parameter used in the strategy calculations.',
          value: [
            'cbBTC - 938.167832',
            'AERO - 15993.676043',
            'USDC - 306.592966',
            'WETH - 22.454340',
          ],
        },
      ],
    },
    {
      name: 'Exponent',
      variations: [
        {
          name: 'Exponent',
          tooltip:
            'The exponent is a variable used in the power channel strategy that dictate how big a price change has to be before the strategy starts to notice it. It is the primary difference between other strategies like momentum.',
          value: [
            'cbBTC - 1',
            'AERO - 2.4705463110202333',
            'USDC - 1',
            'WETH - 1',
          ],
        },
      ],
    },
  ],
};
