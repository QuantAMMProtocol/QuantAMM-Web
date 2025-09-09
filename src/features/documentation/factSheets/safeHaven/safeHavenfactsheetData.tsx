import { FactsheetModel } from '../factsheetModel';
import { PowerChannelUpdateRule } from '../../updateRules/powerChannelUpdateRule';
import { ROUTES } from '../../../../routesEnum';

export const safeHavenFactsheetData: FactsheetModel = {
  poolId: ROUTES.SAFEHAVENFACTSHEET,
  inceptionLpPrice: 15582.16,
  poolChain: 'MAINNET',
  pools: [
    'safeHavenBTFAugTest',
    'safeHavenCFMMAugTest',
    'safeHavenHodlAugTest',
    'safeHavenBTFAugTrain',
    'safeHavenCFMMAugTrain',
    'safeHavenHodlAugTrain',
    'safeHavenBTF2025Test',
    'safeHavenCFMM2025Test',
    'safeHavenHodl2025Test',
  ],
  factsheetImage: {
    image: '/assets/safe_haven_BTF_icon_mono.png',
    width: '30%',
    alt: 'Safe Haven BTF Icon',
  },
  objective: 'The Safe Haven BTF allows for a decentralised, automated and transparent mechanism to allocate to Gold and Bitcoin in a responsive manner that reflects the inherent volatility associated with Bitcoin.',
  deploymentLinks: {
    contractLinks: [
      [
        'Pool Factory Contract',
        'https://etherscan.io/address/0xD5c43063563f9448cE822789651662cA7DcD5773',
      ],
      [
        'Strategy Runner Contract',
        'https://etherscan.io/address/0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748',
      ],
      [
        'Strategy Contract',
        'https://etherscan.io/address/0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295',
      ],
      [
        'Chainlink BTC Oracle',
        'https://etherscan.io/address/0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
      ],
      [
        'Chainlink PAXG Oracle',
        'https://etherscan.io/address/0x9944D86CEB9160aF5C5feB251FD671923323f8C3',
      ],
      [
        'Chainlink USDC Oracle',
        'https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
      ],
    ],
  },
  fixedSettings: [
    ['Strategy Interval', '24H'],
    ['Strategy', 'Power Channel'],
    ['Staleness Limit', '24H'],
    ['Swap Fee', '2%'],
    ['Withdrawal Fee', '0%'],
    ['Streaming Fee', '0%'],
  ],
  defaultPeriod: ['AugTest', 'Test Period: Aug24-Apr25'],
  alternatePeriod: ['2025Test', 'Test Period: Jan-Apr25'],
  trainPeriod: 'AugTrain',
  poolPrefix: 'safeHaven',
  xAxisIntervals: new Map<string, number>([
    ['AugTest', 3],
    ['2025Test', 1],
    ['AugTrain', 22],
    ['default', 22],
  ]),
  mainTitle: 'The Safe Haven BTF',
  mainDescription: `A safe haven is an investment that is expected to retain or 
increase in value during times of global turbulence. Examples of 
safe havens include gold, U.S. Treasury bonds, and certain 
currencies like the United States Dollar. Bitcoin is also 
considered a potential safe haven asset due to its limited supply 
and decentralized nature, which can provide a hedge against 
inflation and currency devaluation.`,
  cumulativePerformanceOverrideSeriesStrokeColor: {
    'Power Channel': '#c7b283',
    'Balancer Weighted': '#528aae',
    HODL: '#52ad80',
  },
  cumulativePerformanceOverrideSeriesName: {
    'Power Channel': 'SAFE HAVEN BTF',
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
            PAXOS tokenisation of gold allows for a combined product that
            bridges the gap between traditional safe havens and blockchain based
            safe havens.
          </p>
          <p>
            With an automatically rebalancing BTF that provides you with a
            transferable pool LP token, you can own a token that will be
            redeemable with the proportional weights and value of the underlying
            assets. All non custodial and on-chain.
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
          tooltip: 'Absolute minimum weight guard rails of 10% and 3% were tested. The final guard rail chosen was 3%.',
          value: ['3%'],
        },
        {
          name: 'Speed Limit',
          tooltip: 'The speed limit weights can change in one day (epsilon max) was selected to be 0.432. The speed limit is tied to a maximum trade size of 10% of pool constituent reserves.',
          value: ['0.432'],
        },
      ],
    },
    {
      name: 'Lambda Settings',
      variations: [
        {
          name: 'Lambda',
          tooltip: 'Lambda is the parameter used in the gradient estimators for the power channel. This is the on-chain value stored in the contracts.',
          value: [
            'BTC - 0.811035769801363300',
            'PAXG - 0.781490597023096500',
            'USDC - 0.289524066401247700',
          ],
        },
        {
          name: 'Memory Days',
          tooltip: 'Memory days is a conversion of the lambda setting to a more understandable unit of the number of days of prices used in the strategy.',
          value: [
            'BTC - 17.93552717',
            'PAXG - 15.31974493',
            'USDC - 3.38396553',
          ],
        },
      ],
    },
    {
      name: 'Aggressiveness',
      variations: [
        {
          name: 'Aggressiveness',
          tooltip: 'Otherwise known as k_per_day. This is the multiplier applied to the strategy signal to get the weight change per day.',
          value: [
            'BTC - 77.55380713',
            'PAXG - 52.65723196',
            'USDC - 75.62990544',
          ],
        },
        {
          name: 'k',
          tooltip: 'k is the on-chain value stored in the contracts and is the exact parameter used in the strategy calculations.',
          value: [
            'BTC - 1390.9684145267538',
            'PAXG - 806.6953621597771',
            'USDC - 255.92899333099183',
          ],
        },
      ],
    },
    {
      name: 'Exponent',
      variations: [
        {
          name: 'Exponent',
          tooltip: 'The exponent is a variable used in the power channel strategy that dictate how big a price change has to be before the strategy starts to notice it. It is the primary difference between other strategies like momentum.',
          value: ['BTC - 1.5312327931176639', 'PAXG - 1', 'USDC - 1'],
        },
      ],
    },
  ],
  iconTitle: 'Safe Haven',
  iconDescription: ['The doomsday BTF', 'Bitcoin, PAXOS Gold, USDC'],
  status: 'LIVE',
  iconOpacity: 1,
  iconFocus: true,
  depositorBadges: {
    prefix:'Safe_Haven_',
    gold:1748213999,
    silver:1749423599,
    bronze:1750633199
  },
  targetPoolJson:'safeHavenBTFAugTest',
  launchUnixTimestamp:1747267200
};
