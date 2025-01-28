//HODL
import hodlEthUSDC from '../prerun_sims/hodl/HODL_-ETH-USDC.json';

//Balancer examples

import balancerWeightedEthUSDC from '../prerun_sims/balancer/Balancer Weighted_ETH-USDC.json';
import balancerWeightedEthUSDCLvr from '../prerun_sims/balancer/LVR - Balancer Weighted_-ETH-USDC.json';
import balancerWeightedEthUSDCRvr from '../prerun_sims/balancer/RVR - Balancer Weighted_-ETH-USDC.json';

//CowAMM examples

import cowAMMEthUSDC from '../prerun_sims/cowAMM/CowAMM[arb_quality_1.0]_-ETH-USDC.json';
import cowAMMEthUSDCLvr from '../prerun_sims/cowAMM/LVR - CowAMM_-ETH-USDC.json';
import cowAMMEthUSDCRvr from '../prerun_sims/cowAMM/RVR - CowAMM_-ETH-USDC.json';

//Gyroscope examples

import qyroscopeEthUSDC from '../prerun_sims/gyroscope/Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.json';
import qyroscopeEthUSDCLvr from '../prerun_sims/gyroscope/LVR - Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.json';
import qyroscopeEthUSDCRvr from '../prerun_sims/gyroscope/RVR - Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.json';

//QuantAMM examples

import btcUSDCEthHodl from '../prerun_sims/quantAMM/Momentum[k_per_day_50][memory_days_5]_-ETH-BTC-USDC.json';
import btcUSDCEthMomentum from '../prerun_sims/quantAMM/Momentum[k_per_day_50][memory_days_5]_-ETH-BTC-USDC.json';
import btcUSDCEthPowerChannel from '../prerun_sims/quantAMM/Power Channel[k_per_day_50][memory_days_5][exponent_1.13]_-BTC-ETH-USDC.json';
import btcUSDCEthAntiMomentum from '../prerun_sims/quantAMM/AntiMomentum[k_per_day_0.005][memory_days_80]_-BTC-ETH-USDC.json';
import btcUSDCEthChannelFollowing from '../prerun_sims/quantAMM/Channel Following_VectorParams.json';
import btcUSDCEthDifferenceMomentum from '../prerun_sims/quantAMM/Difference Momentum[k_per_day_-10,-5,5,2][memory_days_2_100,2,2,5][memory_days_1_70,1,30,15]_-BTC-ETH-PAXG-USDC.json';

import {
  ReturnTimeStep,
  SimulationRunBreakdown,
  SimulationRunBreakdownDto,
} from '../features/simulationResults/simulationResultSummaryModels';
import {
  CoinComparison,
  CoinPrice,
} from '../features/simulationRunConfiguration/simulationRunConfigModels';

type Pool =
  | 'balancerWeighted'
  | 'balancerWeightedLvr'
  | 'balancerWeightedRvr'
  | 'cowAMM'
  | 'cowAmmLvr'
  | 'cowAmmRvr'
  | 'gyroscope'
  | 'gyroscopeLvr'
  | 'gyroscopeRvr'
  | 'quantAMMMomentum'
  | 'quantAMMAntiMomentum'
  | 'quantAMMPowerChannel'
  | 'quantAMMChannelFollowing'
  | 'quantAMMMeanReversionChannel'
  | 'hodlEthUsdc'
  | 'hodlBtcEthUsdc';

export const convertBreakdownDtoToBreakdown = (
  dto: SimulationRunBreakdownDto
): SimulationRunBreakdown => {
  return {
    simulationRun: {
      id: dto.simulationRun.id,
      name: dto.simulationRun.name,
      enableAutomaticArbBots: dto.simulationRun.enableAutomaticArbBots,
      poolNumeraireCoinCode: dto.simulationRun.poolNumeraireCoinCode,
      poolConstituents: dto.simulationRun.poolConstituents.map(
        (constituent) => {
          return {
            coin: {
              coinName: constituent.coin.coinName,
              coinCode: constituent.coin.coinCode,
              dailyPriceHistory: constituent.coin.dailyPriceHistory,
              dailyPriceHistoryMap: new Map<number, CoinPrice>(),
              dailyReturns: new Map<number, ReturnTimeStep>(),
              coinComparisons: new Map<string, CoinComparison>(),
            },
            amount: constituent.amount,
            marketValue: constituent.marketValue,
            currentPrice: constituent.currentPrice,
            currentPriceUnix: constituent.currentPriceUnix,
            weight: constituent.weight,
            factorValue: null,
          };
        }
      ),
      updateRule: dto.simulationRun.updateRule,
      runStatus: dto.simulationRun.runStatus,
      feeHooks: dto.simulationRun.feeHooks,
      swapImports: dto.simulationRun.swapImports,
      poolType: dto.simulationRun.poolType,
    },
    flatSimulationRunResult: dto.flatSimulationRunResult,
    simulationRunStatus: dto.simulationRunStatus,
    simulationRunResultAnalysis: dto.simulationRunResultAnalysis,
    simulationComplete: dto.simulationComplete,
    timeSteps: dto.timeSteps,
    timeRange: dto.timeRange,
  };
};

export const getBreakdown = (poolName: Pool): SimulationRunBreakdown => {
  let pool;
  switch (poolName) {
    case 'balancerWeighted':
      pool = balancerWeightedEthUSDC;
      break;
    case 'balancerWeightedLvr':
      pool = balancerWeightedEthUSDCLvr;
      break;
    case 'balancerWeightedRvr':
      pool = balancerWeightedEthUSDCRvr;
      break;

    case 'cowAMM':
      pool = cowAMMEthUSDC;
      break;

    case 'cowAmmLvr':
      pool = cowAMMEthUSDCLvr;
      break;

    case 'cowAmmRvr':
      pool = cowAMMEthUSDCRvr;
      break;

    case 'gyroscope':
      pool = qyroscopeEthUSDC;
      break;

    case 'gyroscopeLvr':
      pool = qyroscopeEthUSDCLvr;
      break;

    case 'gyroscopeRvr':
      pool = qyroscopeEthUSDCRvr;
      break;
    case 'quantAMMMomentum':
      pool = btcUSDCEthMomentum;
      break;
    case 'quantAMMAntiMomentum':
      pool = btcUSDCEthAntiMomentum;
      break;
    case 'quantAMMPowerChannel':
      pool = btcUSDCEthPowerChannel;
      break;
    case 'quantAMMChannelFollowing':
      pool = btcUSDCEthChannelFollowing;
      break;
    case 'quantAMMMeanReversionChannel':
      pool = btcUSDCEthDifferenceMomentum;
      break;
    case 'hodlEthUsdc':
      pool = hodlEthUSDC;
      break;
    case 'hodlBtcEthUsdc':
      pool = btcUSDCEthHodl;
      break;

    default:
  }

  return convertBreakdownDtoToBreakdown(
    pool as unknown as SimulationRunBreakdownDto
  );
};
