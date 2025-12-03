// Independent exportable coin state constants
import { Coin, CoinPrice } from '../../simulationRunConfigModels';

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
  deploymentByChain: new Map<any, any>(),
};

export const ETHEREUM: Coin = {
  coinName: 'Ethereum',
  coinCode: 'ETH',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const RIPPLE: Coin = {
  coinName: 'Ripple',
  coinCode: 'XRP',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const SOLANA: Coin = {
  coinName: 'Solana',
  coinCode: 'SOL',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const BINANCE: Coin = {
  coinName: 'Binance',
  coinCode: 'BNB',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const USDCOIN: Coin = {
  coinName: 'USDCoin',
  coinCode: 'USDC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const DOGECOIN: Coin = {
  coinName: 'DogeCoin',
  coinCode: 'DOGE',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const CARDANO: Coin = {
  coinName: 'Cardano',
  coinCode: 'ADA',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const TRON: Coin = {
  coinName: 'Tron',
  coinCode: 'TRX',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const CHAINLINK: Coin = {
  coinName: 'Chainlink',
  coinCode: 'LINK',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const AVALANCHE: Coin = {
  coinName: 'Avalanche',
  coinCode: 'AVAX',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const STELLAR: Coin = {
  coinName: 'Stellar',
  coinCode: 'XLM',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const SHIBA_INU: Coin = {
  coinName: 'Shiba Inu',
  coinCode: 'SHIB',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const UNISWAP: Coin = {
  coinName: 'Uniswap',
  coinCode: 'UNI',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const AAVE: Coin = {
  coinName: 'AAVE',
  coinCode: 'AAVE',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const SONIC: Coin = {
  coinName: 'SONIC',
  coinCode: 'S',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const MONERO: Coin = {
  coinName: 'Monero',
  coinCode: 'XMR',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const POLYGON: Coin = {
  coinName: 'Polygon',
  coinCode: 'MATIC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const ALGORAND: Coin = {
  coinName: 'Algorand',
  coinCode: 'ALGO',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const ARBITRUM: Coin = {
  coinName: 'Arbitrum',
  coinCode: 'ARB',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const FILECOIN: Coin = {
  coinName: 'Filecoin',
  coinCode: 'FIL',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const COSMOS: Coin = {
  coinName: 'Cosmos',
  coinCode: 'ATOM',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const EOS: Coin = {
  coinName: 'EOS',
  coinCode: 'EOS',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const MAKER_DAO: Coin = {
  coinName: 'Maker DAO',
  coinCode: 'MKR',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const LIDO: Coin = {
  coinName: 'Lido',
  coinCode: 'LDO',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const DYDX: Coin = {
  coinName: 'DyDx',
  coinCode: 'DYDX',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const COMPOUND: Coin = {
  coinName: 'Compound',
  coinCode: 'COMP',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const CURVE: Coin = {
  coinName: 'Curve',
  coinCode: 'CRV',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const SUSHISWAP: Coin = {
  coinName: 'SushiSwap',
  coinCode: 'SUSHI',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const LITECOIN: Coin = {
  coinName: 'Litecoin',
  coinCode: 'LTC',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};

export const PAX_GOLD: Coin = {
  coinName: 'PAX Gold',
  coinCode: 'PAXG',
  dailyPriceHistoryMap: new Map<number, any>(),
  coinComparisons: new Map<string, any>(),
  dailyPriceHistory: [defaultCoinPrice],
  dailyReturns: new Map<number, any>(),
  deploymentByChain: new Map<any, any>(),
};
