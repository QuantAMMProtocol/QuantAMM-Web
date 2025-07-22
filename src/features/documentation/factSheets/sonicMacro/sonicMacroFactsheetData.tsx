import { FactsheetModel } from '../factsheetModel';
import { ChannelFollowingUpdateRule } from '../../updateRules/channelFollowing';

export const sonicMacroFactsheetData: FactsheetModel = {
  poolId: '0x74dc857d5567a3b087e79b96b91cdc8099b2fa34',
  poolChain: 'SONIC',
  pools: [
    'sonicMacroBTFAugTrain',
    'sonicMacroCFMMAugTrain',
    'sonicMacroHodlAugTrain',
    'sonicMacroBTFAprilTest',
    'sonicMacroCFMMAprilTest',
    'sonicMacroHodlAprilTest',
  ],
  factsheetImage: {
    image: '/assets/sonic_macro_BTF.png',
    width: '30%',
    alt: 'SONIC MACRO BTF Icon',
  },
  objective:
    'The Sonic Macro BTF provides exposure to some of the mega cap tokens on Sonic. The BTF was trained on more bullish market conditions.',
  deploymentLinks: {
    contractLinks: [
      [
        'Pool Factory Contract',
        'https://sonicscan.org/address/0x60006d255569b36a3d494e83D182b57acd04D484',
      ],
      [
        'Strategy Contract',
        'https://sonicscan.org/address/0x18Bd2de107C70222f1cd9796F9aB01458A85d7a7',
      ],
      [
        'Strategy Runner Contract',
        'https://sonicscan.org/address/0xD5c43063563f9448cE822789651662cA7DcD5773',
      ],
      [
        'Chainlink scBTC Oracle',
        'https://sonicscan.org/address/0x8905b91b301677e674cF964Fbc4Ac3844EF79620',
      ],
      [
        'Chainlink USDC Oracle',
        'https://sonicscan.org/address/0x6f2bD10b9b17E80e5BCd49158890561f053Ed2EB',
      ],
      [
        'Chainlink S Oracle',
        'https://sonicscan.org/address/0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295',
      ],
      [
        'Chainlink scETH Oracle',
        'https://sonicscan.org/address/0x4FFE46130bCBb16BF5EDc4bBaa06f158921764C2',
      ],
    ],
  },
  fixedSettings: [
    ['Strategy Interval', '24H'],
    ['Strategy', 'Channel Following'],
    ['Staleness Limit', '24H'],
    ['Swap Fee', '0.03%'],
    ['Withdrawal Fee', '0%'],
    ['Streaming Fee', '0%'],
  ],
  defaultPeriod: ['AprilTest', 'Test Period: Apr-Jul25'],
  alternatePeriod: ['', ''],
  trainPeriod: 'AugTrain',
  poolPrefix: 'sonicMacro',
  xAxisIntervals: new Map<string, number>([
    ['AprilTest', 1],
    ['AugTrain', 14],
    ['default', 22],
  ]),
  mainTitle: 'The Sonic Macro BTF',
  mainDescription: `Sonic is one of the pioneering chains for DeFi. It is a layer 1
              solution and is EVM compatible, designed to provide
              faster and cheaper transactions than other layer 1s. Sonic is designed
              to be a platform for building decentralized applications (dApps) and smart
              contracts, enabling developers to create innovative solutions in
              the DeFi space.`,
  cumulativePerformanceOverrideSeriesStrokeColor: {
    'Channel Following': '#c7b283',
    'Balancer Weighted': '#528aae',
    HODL: '#52ad80',
  },
  cumulativePerformanceOverrideSeriesName: {
    'Channel Following': 'SONIC MACRO BTF',
    'Balancer Weighted': 'Traditional DEX',
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
            The re-weighting strategy and parameters are a visible contract
            on-chain. No opaque strategy vault managers. Chainlink provides data
            integrity.
          </p>
          <p>
            Given novel patented technology the re-weighting strategies run
            cheaply on-chain and daily re-weighting is possible even on L1s.
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
            S is the Sonic native token. While this token carries potential
            protocol risk and higher volatility, it is key token of the Sonic ecosystem.
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
  trainingWindowTitle: 'Training window Jan 2023 - March 2025',
  trainingDescription: (
    <>
      <p>
        The channel following strategy has parameters that determine how aggressive
        a strategy re-weights to different assets as well as the memory of
        prices that get taken into account.
      </p>
      <p>
        A training period of Jan 2023 - March 2025 was selected and parameters
        were selected using the machine learning technique called: Stochastic
        Gradient Descent. This was performed by the QuantAMM team using the
        QuantAMM simulator framework. A parameter set was selected that
        maximised the Sharpe Ratio of the strategy. This was selected over other
        objectives such as maximising Ulcer or Calmer Ratios as the parameter
        set showed better test set statistics. Random 73-day length windows
        were selected within the training price range and optimisation was
        performed via stochastic gradient descent for 6000 steps with batches of
        6 windows per step.
      </p>
    </>
  ),
  
  trainedParameters: [
    {
      name: 'Memory Days',
      variations: [
        {
          name: 'Memory Days',
          tooltip: 'Memory days is the number of days of prices used in the strategy.',
          value: ['BTC - 50.35461604', 'ETH - 5.03696308', 'S - 15.77315714', 'USDC - 7.05245484'],
        },
      ],
    },
    {
      name: 'Lambda Settings',
      variations: [
        {
          name: 'Lambda',
          tooltip: 'Lambda is the parameter used in the gradient estimators for the channel following.',
          value: [
            'BTC - 0.929563018539273',
            'ETH - 0.4479412201204208',
            'S - 0.7872516012227267',
            'USDC - 0.5721879593136455',
          ],
        },
      ],
    },
    {
      name: 'Aggressiveness',
      variations: [
        {
          name: 'k',
          tooltip: 'k is the on-chain value stored in the contracts and is the exact parameter used in the strategy calculations.',
          value: [
            'BTC - 2601.9593723570410',
            'ETH - 89.055850228512313',
            'S - 593.90077382313598',
            'USDC - 93.130867147542816',
          ],
        },
      ],
    },
    {
      name: 'Exponent',
      variations: [
        {
          name: 'Exponent',
          tooltip: 'The exponent is a variable used in the channel following strategy that dictates how big a price change has to be before the strategy starts to notice it.',
          value: [
            'BTC - 0.7832038911979993',
            'ETH - 2.3558801968659950',
            'S - 0.8443489840649794',
            'USDC - 1.0686318158089472',
          ],
        },
      ],
    },
    {
      name: 'Width',
      variations: [
        {
          name: 'Width',
          tooltip: 'Width is the parameter that defines the channel width for the mean reversion strategy.',
          value: [
            'BTC - 0.0086388441051054223',
            'ETH - 0.010606898165675289',
            'S - 0.016622246139525294',
            'USDC - 0.00090359323501604781',
          ],
        },
      ],
    },
    {
      name: 'Amplitude',
      variations: [
        {
          name: 'Amplitude',
          tooltip: 'Amplitude is the parameter that defines the oscillation amplitude for the mean reversion strategy.',
          value: [
            'BTC - 0.074853775497883593',
            'ETH - 0.0027628351279059180',
            'S - 0.011037321655782598',
            'USDC - 0.072324601375887462',
          ],
        },
      ],
    },
    {
      name: 'Pre-exp Scaling',
      variations: [
        {
          name: 'Pre-exp Scaling',
          tooltip: 'Pre-exp scaling is the parameter used for scaling before exponentiation in the strategy calculations.',
          value: [
            'BTC - 0.0002015493093145',
            'ETH - 0.0002238654967055',
            'S - 0.0002970276828945',
            'USDC - 0.0015731331098663',
          ],
        },
      ],
    },
  ],
};
