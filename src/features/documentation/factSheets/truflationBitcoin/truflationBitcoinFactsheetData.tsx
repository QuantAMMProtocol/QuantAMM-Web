import { FactsheetModel } from '../../landing/desktop/factsheetModel';
import { ChannelFollowingUpdateRule } from '../../updateRules/channelFollowing';
import { ROUTES } from '../../../../routesEnum';

export const truflationBitcoinFactsheetData: FactsheetModel = {
  poolId: ROUTES.TRUFLATIONBITCOINFACTSHEET,
  inceptionLpPrice:3023,
  poolChain: 'MAINNET',
  pools: [
    'truflationBitcoinBTFJuneTrain',
    'truflationBitcoinCFMMJuneTrain',
    'truflationBitcoinHodlJuneTrain',
    'truflationBitcoinBTF2025Test',
    'truflationBitcoinCFMM2025Test',
    'truflationBitcoinHodl2025Test',
  ],
  factsheetImage: {
    image: '/assets/truflation_bitcoin_mono.png',
    width: '30%',
    alt: 'TRUFLATION BITCOIN BTF Icon',
  },
  objective: 'Truflation has created an inflation based strategy that shows historical correlation with Bitcoin bull runs. This BTF either stays in USDC or gains BTC exposure based on this metric',
  deploymentLinks: {
    contractLinks: [
      [
        'Pool Factory Contract',
        'https://etherscan.org/address/0x60006d255569b36a3d494e83D182b57acd04D484',
      ],
      [
        'Strategy Contract',
        'https://etherscan.org/address/0x18Bd2de107C70222f1cd9796F9aB01458A85d7a7',
      ],
      [
        'Strategy Runner Contract',
        'https://etherscan.org/address/0xD5c43063563f9448cE822789651662cA7DcD5773',
      ]
    ],
  },
  fixedSettings: [
    ['Strategy Interval', '24H'],
    ['Strategy', 'Truflation BTC Regime'],
    ['Staleness Limit', '24H'],
    ['Swap Fee', '0.03%'],
    ['Withdrawal Fee', '0%'],
    ['Streaming Fee', '0%'],
  ],
  defaultPeriod: ['2025Test', 'Test Period: Jan-Dec25'],
  alternatePeriod: ['', ''],
  trainPeriod: 'JuneTrain',
  poolPrefix: 'truflationBitcoin',
  xAxisIntervals: new Map<string, number>([
    ['2025Test', 2],
    ['JuneTrain', 10],
    ['default', 22],
  ]),
  mainTitle: 'Truflation Bitcoin BTF',
  mainDescription: `Truflation is a leading provider of alternate daily inflation data that has gained notoriety given its increased accuracy compared to standard truflation data. `,
  cumulativePerformanceOverrideSeriesStrokeColor: {
    'Truflation BTC Regime': '#c7b283',
    'Balancer Weighted': '#528aae',
    HODL: '#52ad80',
  },
  cumulativePerformanceOverrideSeriesName: {
    'Truflation BTC Regime': 'Truflation BTC BTF',
    'Balancer Weighted': 'Traditional HODL',
    'HODL': 'BTC ONLY HODL',
  },

  updateRule: <ChannelFollowingUpdateRule hideTitle={true} hideImage={true} />,
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
          <p>QuantAMM believes in transparency through decentralisation</p>
          <p>
            The re-weighting strategy and parameters are run on Chainlink CRE.
            The runtime environment is fixed and the workflow cannot be altered without admin permissions.
          </p>
          <p>
            Chainlink CRE is institutional grade infrastructure that provides admin control however during
            standard operations is verified by Chainlink.
          </p>
        </>
      ),
    },
    {
      title: 'Secure Balancer Vault',
      description: (
        <>
          <p>
            QuantAMM is a Balancer V3 launch partner. The state-of-the-art
            Balancer Vault manages all non-custodial deposits and withdrawals
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
      title: 'Cross Asset Baskets',
      description: (
        <>
          <p>
            USDC provides a stablecoin that is the most widely used in DeFi. It
            is the most liquid and widely accepted stablecoin in the crypto
            ecosystem.
          </p>
          <p>
            ARB is the Arbitrum native token. While this token carries potential
            protocol risk and higher volatility, it is key token of the Arbitrum ecosystem.
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
            finance is used to. However, they do take positions based on their
            interpretation of markets. This is a directional position that will
            incur risk and loss of capital if the market moves against the
            strategy.
          </p>
          <p>
            As Bitcoin is a volatile asset, even though it can be considered a
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
            this; however, a loss in such a scenario is dependent on the timing
            of any intervention. If a pool is paused or in a recovery state, you
            can still withdraw the underlying assets at a proportional quantity
            to your LP tokens.
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
            QuantAMM has performed private audits of the code as well as
            competitive third-party audits. Balancer has also performed the same
            and has large bug bounties to incentivise identification of any
            issues.
          </p>
        </>
      ),
    },
    {
      title: 'Oracle / Data Manipulation',
      description: (
        <>
          <p>
            Re-weightings rely on inflation data on the TRUF network. This data has to be correct for
            the strategy to run.
          </p>
          <p>
            TRUF network is a chain that provides inflation data for Truflation. The manipulability
            of the data source is protected by Truflation and not by QuantAMM. 
          </p>
          <p>
            Manipulation of the inflation data can put the weights into one of 3 regimes however it cannot
            determine new weights. Those weights are controlled by CRE. 
          </p>
        </>
      ),
    },
  ],
  trainingWindowTitle: 'Training window June 2023 - Dec 2024',
  trainingDescription: (
    <>
      <p>
        The Truflation BTC strategy has parameters that determine how aggressive
        a strategy re-weights to different assets as well as when to re-weight.
      </p>
      <p>
        A training period of June 2023 - Dec 2024 was selected and parameters
        were selected using the machine learning optimization method ADAM.
        This was performed by the QuantAMM team using the
        QuantAMM simulator framework. A parameter set was selected that
        maximised the Sharpe Ratio of the strategy. This was selected over other
        objectives such as maximising Ulcer or Calmer Ratios as the parameter
        set showed better test set statistics. Random 6 month length windows
        were selected within the training price range and optimisation was
        performed via stochastic gradient descent for 1000 steps with batches of
        8 windows per step.
      </p>
    </>
  ),

  trainedParameters: [
    {
      name: 'Slope Length',
      variations: [
        {
          name: 'Slope Length',
          tooltip: 'The lookback period for the slope calculation.',
          value: ['2 days'],
        },
      ],
    },
    {
      name: 'Threshold Up',
      variations: [
        {
          name: 'Threshold Up',
          tooltip: 'Defines the positive slope value that must be exceeded to trigger a potential switch to an Uptrend from a Flat state (or directly from a Downtrend). Marks the upper boundary of the "neutral" zone for initiating new trends.',
          value: [
            '-1.0363972',
          ],
        },
      ],
    },
    {
      name: 'Threshold Down',
      variations: [
        {
          name: 'Threshold Down',
          tooltip: 'Defines the negative slope value below which the system triggers a potential switch to a Downtrend from a Flat state (or directly from an Uptrend). Marks the lower boundary of the "neutral" zone for initiating new trends.',
          value: [
            '0.02426888',
          ],
        },
      ],
    },
    {
      name: 'Flat Buffer Up',
      variations: [
        {
          name: 'Flat Buffer Up',
          tooltip: 'A hysteresis threshold used to maintain an existing Uptrend; the slope must fall below this value (while remaining above threshold_down) to downgrade the state from Uptrend back to Flat.',
          value: [
            '2.01109116',
          ],
        },
      ],
    },
    {
      name: 'Flat Buffer DOWN',
      variations: [
        {
          name: 'Flat Buffer DOWN',
          tooltip: 'A hysteresis threshold used to maintain an existing Downtrend; the slope must rise above this value (while remaining below threshold_up) to upgrade the state from Downtrend back to Flat.',
          value: [
            '-0.33645896',
          ],
        },
      ],
    },
    {
      name: 'Confirm Up Days',
      variations: [
        {
          name: 'Confirm Up Days',
          tooltip: 'The number of consecutive time steps the slope condition must remain in the "Uptrend" zone to confirm and lock in a regime change to Uptrend.',
          value: [
            '5.34041237',
          ],
        },
      ],
    },
    {
      name: 'Confirm Down Days',
      variations: [
        {
          name: 'Confirm Down Days',
          tooltip: 'The number of consecutive time steps the slope condition must remain in the "Downtrend" zone to confirm and lock in a regime change to Downtrend.',
          value: [
            '5.20466189',
          ],
        },
      ],
    },
    {
      name: 'Confirm Flat Days',
      variations: [
        {
          name: 'Confirm Flat Days',
          tooltip: 'The number of consecutive time steps the slope condition must remain in the "Flat" zone to confirm and lock in a regime change to Flat.',
          value: [
            '2.69850236',
          ],
        },
      ],
    },
  ],
  iconTitle: 'Truflation Bitcoin',
  iconDescription: ['Truflation Bitcoin BTF', 'BTC vault curated by Truflation'],
  status: 'LIVE',
  iconOpacity: 1,
  iconFocus: true,
  depositorBadges: {
    prefix:'Safe_Haven_',
    gold:1748213999,
    silver:1749423599,
    bronze:1750633199
  },
  targetPoolJson:'truflationBitcoinBTF2025Test',
  launchUnixTimestamp:1747267200
};
