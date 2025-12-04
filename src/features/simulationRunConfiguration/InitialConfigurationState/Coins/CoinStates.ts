// Independent exportable coin state constants
import { Chain, Coin, CoinPrice, DeployedToken } from '../../simulationRunConfigModels';

const defaultCoinPrice: CoinPrice = {
  date: '2020-01-01 00:00:00:00',
  unix: 1234,
  open: 1234,
  high: 1234,
  low: 1234,
  close: 1234,
};

export const BITCOIN: Coin = {
  coinName: 'Bitcoin',
  coinCode: 'BTC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Ethereum,
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        oracles: new Map<string, string>([
          ['Chainlink', '0x966ed29C73F1BDA6061834C04413C9460FC2E47f'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Base,
      {
        address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
        oracles: new Map<string, string>([
          ['Chainlink', '0x34eF06b7b54F6928AB9B3b8149f9C652e54faB53'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Arbitrum,
      {
        address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        oracles: new Map<string, string>([
          ['Chainlink', '0x34eF06b7b54F6928AB9B3b8149f9C652e54faB53'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Sonic,
      {
        address: '0xbb30e76d9bb2cc9631f7fc5eb8e87b5aff32bfbd',
        oracles: new Map<string, string>([
          ['Chainlink', '0x8905b91b301677e674cF964Fbc4Ac3844EF79620'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
  ]),
};

export const ETHEREUM: Coin = {
  coinName: 'Ethereum',
  coinCode: 'ETH',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Ethereum,
      {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        oracles: new Map<string, string>([
          ['Chainlink', '0x34eF06b7b54F6928AB9B3b8149f9C652e54faB53'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Base,
      {
        address: '0x4200000000000000000000000000000000000006',
        oracles: new Map<string, string>([
          ['Chainlink', '0x966ed29C73F1BDA6061834C04413C9460FC2E47f'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Arbitrum,
      {
        address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        oracles: new Map<string, string>([
          ['Chainlink', '0x966ed29C73F1BDA6061834C04413C9460FC2E47f'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Sonic,
      {
        address: '0x50c42deacd8fc9773493ed674b675be577f2634b',
        oracles: new Map<string, string>([
          ['Chainlink', '0x4FFE46130bCBb16BF5EDc4bBaa06f158921764C2'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
  ]),
};

export const RIPPLE: Coin = {
  coinName: 'Ripple',
  coinCode: 'XRP',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const SOLANA: Coin = {
  coinName: 'Solana',
  coinCode: 'SOL',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const BINANCE: Coin = {
  coinName: 'Binance',
  coinCode: 'BNB',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const USDCOIN: Coin = {
  coinName: 'USDCoin',
  coinCode: 'USDC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Ethereum,
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        oracles: new Map<string, string>([
          ['Chainlink', '0x966ed29C73F1BDA6061834C04413C9460FC2E47f'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Base,
      {
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        oracles: new Map<string, string>([
          ['Chainlink', '0xaAFB604Dc5c7D178e767eD576cA9aa6D48B350C2'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Arbitrum,
      {
        address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        oracles: new Map<string, string>([
          ['Chainlink', '0xaAFB604Dc5c7D178e767eD576cA9aa6D48B350C2'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
    [
      Chain.Sonic,
      {
        address: '0x29219dd400f2bf60e5a23d13be72b486d4038894',
        oracles: new Map<string, string>([
          ['Chainlink', '0x8905b91b301677e674cF964Fbc4Ac3844EF79620'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
  ]),
};

export const DOGECOIN: Coin = {
  coinName: 'DogeCoin',
  coinCode: 'DOGE',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const CARDANO: Coin = {
  coinName: 'Cardano',
  coinCode: 'ADA',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const TRON: Coin = {
  coinName: 'Tron',
  coinCode: 'TRX',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const CHAINLINK: Coin = {
  coinName: 'Chainlink',
  coinCode: 'LINK',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const AVALANCHE: Coin = {
  coinName: 'Avalanche',
  coinCode: 'AVAX',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const STELLAR: Coin = {
  coinName: 'Stellar',
  coinCode: 'XLM',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const SHIBA_INU: Coin = {
  coinName: 'Shiba Inu',
  coinCode: 'SHIB',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const UNISWAP: Coin = {
  coinName: 'Uniswap',
  coinCode: 'UNI',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const AAVE: Coin = {
  coinName: 'AAVE',
  coinCode: 'AAVE',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Ethereum,
      {
        address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        oracles: new Map<string, string>(),
        approvalStatus: false,
      } as DeployedToken,
    ],
    [
      Chain.Base,
      {
        address: '0x63706e401c06ac8513145b7687a14804d17f814b',
        oracles: new Map<string, string>(),
        approvalStatus: false,
      } as DeployedToken,
    ],
  ]),
};

export const SONIC: Coin = {
  coinName: 'SONIC',
  coinCode: 'S',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Sonic,
      {
        address: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
        oracles: new Map<string, string>([
          ['Chainlink', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
  ]),
};

export const MONERO: Coin = {
  coinName: 'Monero',
  coinCode: 'XMR',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const POLYGON: Coin = {
  coinName: 'Polygon',
  coinCode: 'MATIC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const AERODROME: Coin = {
  coinName: 'Aerodrome',
  coinCode: 'AERO',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Base,
      {
        address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
        oracles: new Map<string, string>([
          ['Chainlink', '0x18Bd2de107C70222f1cd9796F9aB01458A85d7a7'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
  ]),
};

export const ALGORAND: Coin = {
  coinName: 'Algorand',
  coinCode: 'ALGO',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const ARBITRUM: Coin = {
  coinName: 'Arbitrum',
  coinCode: 'ARB',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const FILECOIN: Coin = {
  coinName: 'Filecoin',
  coinCode: 'FIL',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const COSMOS: Coin = {
  coinName: 'Cosmos',
  coinCode: 'ATOM',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const EOS: Coin = {
  coinName: 'EOS',
  coinCode: 'EOS',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const MAKER_DAO: Coin = {
  coinName: 'Maker DAO',
  coinCode: 'MKR',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const LIDO: Coin = {
  coinName: 'Lido',
  coinCode: 'LDO',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const DYDX: Coin = {
  coinName: 'DyDx',
  coinCode: 'DYDX',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const COMPOUND: Coin = {
  coinName: 'Compound',
  coinCode: 'COMP',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const CURVE: Coin = {
  coinName: 'Curve',
  coinCode: 'CRV',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const SUSHISWAP: Coin = {
  coinName: 'SushiSwap',
  coinCode: 'SUSHI',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const LITECOIN: Coin = {
  coinName: 'Litecoin',
  coinCode: 'LTC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>(),
};

export const PAX_GOLD: Coin = {
  coinName: 'PAX Gold',
  coinCode: 'PAXG',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<Chain, DeployedToken>([
    [
      Chain.Ethereum,
      {
        address: '0x45804880de22913dafe09f4980848ece6ecbaf78',
        oracles: new Map<string, string>([
          ['Chainlink', '0xaAFB604Dc5c7D178e767eD576cA9aa6D48B350C2'],
        ]),
        approvalStatus: true,
      } as DeployedToken,
    ],
  ]),
};
